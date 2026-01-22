import fs from 'fs/promises';
import path from 'path';

export interface DiscoveryPromptContext {
    userName: string;
    companyName: string;
    worldview: string;
    website: string;
    turnCount: number;
    isFollowUp?: boolean;
    previousExperiments?: Array<{
        name: string;
        type: string;
        pattern: string;
        industries: string[];
        status: string;
    }>;
}

const PROMPT_DIR = path.join(process.cwd(), 'lib/prompts/discovery');

/**
 * Orchestrator to dynamically assemble the system prompt based on conversation state.
 */
export async function getDiscoverySystemPrompt(context: DiscoveryPromptContext): Promise<string> {
    const { turnCount, userName, companyName } = context;

    const truncate = (str: string, max: number) => {
        if (!str) return 'No data provided.';
        if (str.length <= max) return str;
        return str.substring(0, max) + '... [TRUNCATED]';
    };

    const worldview = truncate(context.worldview, 3000);
    const website = truncate(context.website, 3000);

    // 1. Determine which segments to include based on turnCount and followup mode
    const segments = ['system.md', 'core.md', 'style.md'];

    // For follow-up sessions, add the follow-up specific prompt
    if (context.isFollowUp) {
        segments.push('followup.md');
        // Skip examples.md in follow-up mode - it has initial discovery templates
    } else {
        // Only add examples.md for initial discovery
        if (turnCount === 0) {
            segments.push('examples.md');
        }
    }

    if (turnCount > 0 && !context.isFollowUp) {
        segments.push('execution.md');
        segments.push('guidelines.md');
    }

    if (turnCount >= 4) {
        segments.push('strategy.md');
    }

    if (turnCount >= 8) {
        segments.push('output.md');
    }

    // 2. Load and combine segments
    let combinedPrompt = '';
    for (const segment of segments) {
        try {
            const content = await fs.readFile(path.join(PROMPT_DIR, segment), 'utf-8');
            combinedPrompt += '\n\n' + content;
        } catch (error) {
            console.error('Error loading prompt segment [' + segment + ']:', error);
        }
    }

    // 3. Inject variables
    let finalPrompt = combinedPrompt;
    finalPrompt = finalPrompt.replace(/\{\{user_name\}\}/g, userName || 'User');
    finalPrompt = finalPrompt.replace(/\{\{company_name\}\}/g, companyName || 'the company');
    finalPrompt = finalPrompt.replace(/\{\{worldview_full\}\}/g, worldview || 'No worldview provided.');
    finalPrompt = finalPrompt.replace(/\{\{website_scrape\}\}/g, website || 'No website content provided.');
    finalPrompt = finalPrompt.replace(/\{\{current_date\}\}/g, new Date().toLocaleDateString());

    // Format previous experiments summary for follow-up mode
    if (context.isFollowUp && context.previousExperiments && context.previousExperiments.length > 0) {
        const experimentsSummary = context.previousExperiments.map((exp, index) =>
            `${index + 1}. **${exp.name}** (${exp.type})\n   - Status: ${exp.status}\n   - Pattern: ${exp.pattern}\n   - Industries: ${exp.industries.join(', ')}`
        ).join('\n\n');
        finalPrompt = finalPrompt.replace(/\{\{previous_experiments_summary\}\}/g, experimentsSummary);
    } else {
        finalPrompt = finalPrompt.replace(/\{\{previous_experiments_summary\}\}/g, 'No previous experiments.');
    }

    // 4. Add dynamic runtime instructions
    let runtimeInstructions = '\n\n--------------------------------------------------------------------------------\nRUNTIME INSTRUCTIONS:\n';

    if (turnCount === 0) {
        runtimeInstructions += '\nCRITICAL: This is the very first message.\n';
        runtimeInstructions += '1. Run the "FIRST QUESTION ALGORITHM" in Section 13.\n';
        runtimeInstructions += '2. Explicitly identify which Quadrant (Q1-Q4) applies based on the onboarding data.\n';
        runtimeInstructions += '3. Select the EXACT template logic for that quadrant.\n';
        runtimeInstructions += '4. Fill in the analysis and question with data from context.\n';
    }

    runtimeInstructions += '\nCRITICAL: At the very end of your response, after ALL your text, provide a suggested 4 - 6 word placeholder for the user\'s next input.\n';
    runtimeInstructions += 'Format it EXACTLY as: [[PLACEHOLDER: text here]].\n';
    runtimeInstructions += 'It MUST start with a leading phrase like "My users usually..." or "The main problem is...".\n';
    runtimeInstructions += 'The placeholder MUST be relevant to your last question.\n';

    return finalPrompt + runtimeInstructions;
}
