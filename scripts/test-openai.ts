import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
    console.log('Testing OpenAI API Key...');
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: 'Say "OpenAI is working!"' }],
        });
        console.log('Success!');
        console.log('Response:', response.choices[0].message.content);
    } catch (error) {
        console.error('Error during OpenAI test:');
        if (error.status) console.error('Status:', error.status);
        if (error.message) console.error('Message:', error.message);
        if (error.code) console.error('Code:', error.code);
    }
}

testOpenAI();
