'use server'

import { revalidatePath } from 'next/cache'
import {
    serverGetCampaigns,
    serverCreateCampaign,
    serverUpdateCampaign,
    serverDeleteCampaign,
    type CampaignResponse,
} from '@/lib/api/server-campaigns'

// ============================================================================
// Frontend Types (use string IDs for URL compatibility)
// ============================================================================

export interface Campaign {
    id: string
    workspace_id: string
    experiment_id: string
    name: string
    status: 'active' | 'paused' | 'completed'
    created_at: string
    updated_at: string
}

// ============================================================================
// Helpers
// ============================================================================

function mapCampaignToFrontend(campaign: CampaignResponse): Campaign {
    return {
        id: String(campaign.CampaignID),
        workspace_id: String(campaign.ProjectID),
        experiment_id: campaign.ExperimentID ? String(campaign.ExperimentID) : '',
        name: campaign.Name,
        status: campaign.Status,
        created_at: campaign.CreatedAt,
        updated_at: campaign.UpdatedAt,
    }
}

// ============================================================================
// Campaign Actions
// ============================================================================

export async function getCampaigns(workspaceId: string) {
    try {
        const campaigns = await serverGetCampaigns(Number(workspaceId))
        return campaigns.map(mapCampaignToFrontend)
    } catch (error) {
        console.error('Unexpected error in getCampaigns:', error)
        return []
    }
}

export async function createCampaign(workspaceId: string, experimentId: string, name: string) {
    try {
        const campaign = await serverCreateCampaign(Number(workspaceId), {
            name,
            experimentId: experimentId ? Number(experimentId) : undefined,
        })

        revalidatePath(`/dashboard/${workspaceId}`)
        return mapCampaignToFrontend(campaign)
    } catch (error) {
        console.error('Unexpected error in createCampaign:', error)
        throw error
    }
}

export async function updateCampaign(campaignId: string, data: Partial<Campaign>) {
    try {
        const updateData: Parameters<typeof serverUpdateCampaign>[1] = {}
        if (data.name !== undefined) updateData.name = data.name
        if (data.status !== undefined) updateData.status = data.status

        await serverUpdateCampaign(Number(campaignId), updateData)
        return { success: true }
    } catch (error) {
        console.error('Unexpected error in updateCampaign:', error)
        throw error
    }
}

export async function deleteCampaign(campaignId: string) {
    try {
        await serverDeleteCampaign(Number(campaignId))
        return { success: true }
    } catch (error) {
        console.error('Unexpected error in deleteCampaign:', error)
        throw error
    }
}
