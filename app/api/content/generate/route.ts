import { NextRequest, NextResponse } from 'next/server';
import { ContentEngineService } from '@/lib/content-engine/service';
import { GenerationRequest } from '@/lib/content-engine/types';

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as GenerationRequest;

        // Ensure we have business context, or fallback to ShipSync
        if (!body.business || !body.business.companyName) {
            body.business = ContentEngineService.getShipSyncContext();
        }

        if (!body.prospect || !body.fit) {
            return NextResponse.json(
                { error: 'Missing prospect or fit data' },
                { status: 400 }
            );
        }

        const result = await ContentEngineService.generateOutreach(body);

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error('[Content API Error]:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
