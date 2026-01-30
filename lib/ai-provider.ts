import OpenAI from 'openai';
import { GoogleGenerativeAI, Content, ModelParams } from '@google/generative-ai';

// Initialize clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatCompletionOptions {
    model?: string;
    messages: ChatMessage[];
    temperature?: number;
    stream?: boolean;
}

export interface ChatCompletionResult {
    content: string;
    provider: 'openai' | 'gemini';
}

function sanitizeContent(content: string): string {
    const destructivePatterns = [
        /rm\s+-rf\b/i,
        /rm\s+-f\s+-r\b/i,
        /rm\s+-r\s+-f\b/i,
        /mkfs\b/i,
        /dd\s+if=\/dev\/zero\b/i,
        />\s*\/dev\/sda\b/i,
        /shred\b/i
    ];

    let sanitized = content;
    for (const pattern of destructivePatterns) {
        if (pattern.test(sanitized)) {
            console.warn('[Security] Destructive command detected and blocked:', pattern);
            sanitized = sanitized.replace(pattern, '[DESTRUCTIVE COMMAND BLOCKED]');
        }
    }
    return sanitized;
}

/**
 * Attempts to call OpenAI first. If rate limited (429), falls back to Gemini.
 */
export async function chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    const { model = 'gpt-4o', messages, temperature = 1 } = options;

    try {
        // Try OpenAI first
        const response = await openai.chat.completions.create({
            model,
            messages,
            temperature,
        });

        const content = response.choices[0]?.message?.content || '';
        return { content: sanitizeContent(content), provider: 'openai' };

    } catch (error: unknown) {
        const err = error as { status?: number; code?: string; message?: string };
        const isRateLimitError = err?.status === 429 ||
            err?.code === 'rate_limit_exceeded' ||
            err?.message?.includes('429') ||
            err?.message?.includes('rate limit') ||
            err?.message?.includes('quota');

        if (isRateLimitError) {
            console.warn('[AI Provider] OpenAI rate limited or quota exceeded, falling back to Gemini...');
            return await geminiChatCompletion(messages, temperature);
        }

        throw error;
    }
}

/**
 * Streaming chat completion with automatic fallback
 */
export async function chatCompletionStream(options: ChatCompletionOptions): Promise<{
    stream: ReadableStream;
    provider: 'openai' | 'gemini';
}> {
    const { model = 'gpt-4o', messages, temperature = 1 } = options;

    try {
        // Try OpenAI first
        const response = await openai.chat.completions.create({
            model,
            messages,
            temperature,
            stream: true,
        });

        const originalStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                    controller.close();
                } catch (e) {
                    controller.error(e);
                }
            },
        });

        // Add safety transform to stream
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        let buffer = '';

        const transformStream = new TransformStream({
            transform(chunk, controller) {
                const text = decoder.decode(chunk, { stream: true });
                buffer += text;

                // If buffer contains destructive command, block everything from here
                const destructivePatterns = [/rm\s+-rf\b/i, /mkfs\b/i, /dd\s+if=\/dev\/zero\b/i];
                if (destructivePatterns.some(p => p.test(buffer))) {
                    console.error('[Security] Destructive command detected in AI stream! Blocking further output.');
                    controller.enqueue(encoder.encode('\n\n[DESTRUCTIVE COMMAND BLOCKED]'));
                    controller.terminate(); // Terminate the stream for safety
                    return;
                }

                controller.enqueue(chunk);
            }
        });

        return { stream: originalStream.pipeThrough(transformStream), provider: 'openai' };

    } catch (error: unknown) {
        const err = error as { status?: number; code?: string; message?: string };
        const isRateLimitError = err?.status === 429 ||
            err?.code === 'rate_limit_exceeded' ||
            err?.message?.includes('429') ||
            err?.message?.includes('rate limit') ||
            err?.message?.includes('quota');

        if (isRateLimitError) {
            console.warn('[AI Provider] OpenAI rate limited or quota exceeded, falling back to Gemini streaming...');
            return await geminiChatCompletionStream(messages, temperature);
        }

        throw error;
    }
}

/**
 * Convert OpenAI messages to Gemini format, ensuring strictly alternating roles
 */
function convertMessagesToGeminiFormat(messages: ChatMessage[]) {
    // Extract system instructions
    const systemMessages = messages.filter(m => m.role === 'system').map(m => m.content);
    const systemInstruction = systemMessages.join('\n\n');

    // Filter non-system messages
    const nonSystemMessages = messages.filter(m => m.role !== 'system');

    // Gemini history format: strictly alternating 'user' and 'model'
    const history: Content[] = [];

    for (const msg of nonSystemMessages) {
        const role = msg.role === 'assistant' ? 'model' : 'user';
        const lastMsg = history[history.length - 1];

        if (lastMsg && lastMsg.role === role) {
            // Merge consecutive same-role messages
            lastMsg.parts[0].text += '\n\n' + msg.content;
        } else {
            // Gemini MUST start with 'user'
            if (history.length === 0 && role === 'model') {
                history.push({ role: 'user', parts: [{ text: 'Please start the discovery process.' }] });
            }
            history.push({ role, parts: [{ text: msg.content }] });
        }
    }

    // Ensure history is not empty
    if (history.length === 0) {
        history.push({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    // Last message must be from user for sendMessage/sendMessageStream
    let lastUserMessage = 'Continue';
    if (history[history.length - 1].role === 'user') {
        const last = history.pop();
        lastUserMessage = last?.parts[0]?.text || 'Continue';
    } else {
        lastUserMessage = 'Please continue based on the above.';
    }

    return {
        systemInstruction,
        history,
        lastUserMessage
    };
}

/**
 * Gemini fallback for regular chat completion
 */
async function geminiChatCompletion(messages: ChatMessage[], temperature: number): Promise<ChatCompletionResult> {
    const { systemInstruction, history, lastUserMessage } = convertMessagesToGeminiFormat(messages);

    const modelParams: ModelParams = {
        model: 'gemini-1.5-flash',
        generationConfig: { temperature }
    };

    if (systemInstruction) {
        modelParams.systemInstruction = {
            role: 'system',
            parts: [{ text: systemInstruction }]
        };
    }

    console.log(`[AI Provider] Using Gemini model: ${modelParams.model}`);
    const model = gemini.getGenerativeModel(modelParams);
    const chat = model.startChat({ history });

    const result = await chat.sendMessage(lastUserMessage);
    const content = result.response.text();

    return { content: sanitizeContent(content), provider: 'gemini' };
}

/**
 * Gemini fallback for streaming chat completion
 */
async function geminiChatCompletionStream(messages: ChatMessage[], temperature: number): Promise<{
    stream: ReadableStream;
    provider: 'gemini';
}> {
    const { systemInstruction, history, lastUserMessage } = convertMessagesToGeminiFormat(messages);

    const modelParams: ModelParams = {
        model: 'gemini-1.5-flash',
        generationConfig: { temperature }
    };

    if (systemInstruction) {
        modelParams.systemInstruction = {
            role: 'system',
            parts: [{ text: systemInstruction }]
        };
    }

    console.log(`[AI Provider] Using Gemini model (stream): ${modelParams.model}`);
    const model = gemini.getGenerativeModel(modelParams);
    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(lastUserMessage);

    const originalStream = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of result.stream) {
                    const text = chunk.text();
                    controller.enqueue(new TextEncoder().encode(text));
                }
                controller.close();
            } catch (e) {
                controller.error(e);
            }
        },
    });

    // Add safety transform to Gemini stream
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let buffer = '';

    const transformStream = new TransformStream({
        transform(chunk, controller) {
            const text = decoder.decode(chunk, { stream: true });
            buffer += text;

            const destructivePatterns = [/rm\s+-rf\b/i, /mkfs\b/i, /dd\s+if=\/dev\/zero\b/i];
            if (destructivePatterns.some(p => p.test(buffer))) {
                console.error('[Security] Destructive command detected in AI stream (Gemini)!');
                controller.enqueue(encoder.encode('\n\n[DESTRUCTIVE COMMAND BLOCKED]'));
                controller.terminate();
                return;
            }

            controller.enqueue(chunk);
        }
    });

    return { stream: originalStream.pipeThrough(transformStream), provider: 'gemini' };
}
