import { ContentEngineService } from '../lib/content-engine/service';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value.length > 0) {
            process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
        }
    });
}

function readFile(filename: string): string {
    const dir = path.join(__dirname, '../content-engine/storage/11');
    const filePath = path.join(dir, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`[Warning] File not found: ${filePath}`);
        return '';
    }
    return fs.readFileSync(filePath, 'utf8');
}

async function verifyContentGeneration() {
    console.log('🚀 Starting Advanced Content Engine Verification...');

    const businessContext = readFile('input_business_context.md');
    const businessOffer = readFile('input_business_offer.md');
    const prospectProfile = readFile('input_prospect_profile.md');
    const recentActivity = readFile('input_recent_activity.md');
    const recentPosts = readFile('input_recent_posts.md');

    const mockBusiness = {
        companyName: 'ShipSync',
        onboardingContext: businessContext,
        offer: businessOffer,
    };

    const mockProspect = {
        firstName: 'Raul',
        lastName: 'Wald',
        role: 'Education Manager',
        company: 'Mbanq',
        fullProfile: prospectProfile,
        rawActivity: recentActivity,
        icpCategory: 'Fintech Education',
        recentPosts: [
            { gist: 'Shared Emergent funding news.', date: 'recent' }
        ]
    };

    const mockFit = {
        logicalConnection: 'Raul is active in the fintech space and recently engaged with our brand.',
        warmthLevel: 'warm_mention',
        shouldProceed: true
    };

    try {
        console.log('\n--- Requesting Advanced Generation ---');
        const result = await ContentEngineService.generateOutreach({
            business: mockBusiness,
            prospect: mockProspect,
            fit: mockFit
        });

        console.log('\n✅ Generation Successful!');
        console.log('\n--- Result ---');
        console.log('Should Reach Out:', result.shouldReachOut);
        console.log('Reason:', result.reason);
        console.log('Best Action:', result.bestAction);
        console.log('\nConnection Request:\n', result.connectionRequest);
        console.log('\nFollow-up DM:\n', result.followUpDM);

        if (result.thinking) {
            console.log('\n--- Thinking ---');
            console.log('Approach:', result.thinking.whyThisApproach);
        }

    } catch (error) {
        console.error('\n❌ Generation Failed:', error);
        process.exit(1);
    }
}

verifyContentGeneration();
