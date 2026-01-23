'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Campaign {
    id: string
    workspace_id: string
    experiment_id: string
    name: string
    status: 'active' | 'paused' | 'completed'
    created_at: string
    updated_at: string
}

export async function getCampaigns(workspaceId: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.log('getCampaigns: No authenticated user')
            return []
        }

        const { data: campaigns, error } = await supabase
            .from('campaigns')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching campaigns:', error)
            return []
        }

        return campaigns as Campaign[]
    } catch (error) {
        console.error('Unexpected error in getCampaigns:', error)
        return []
    }
}

export async function createCampaign(workspaceId: string, experimentId: string, name: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('User must be authenticated')
        }

        const { data: campaign, error } = await supabase
            .from('campaigns')
            .insert({
                workspace_id: workspaceId,
                experiment_id: experimentId,
                name: name,
                status: 'active'
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating campaign:', error)
            throw new Error(error.message)
        }

        revalidatePath(`/dashboard/${workspaceId}`)
        return campaign as Campaign
    } catch (error) {
        console.error('Unexpected error in createCampaign:', error)
        throw error
    }
}

export async function updateCampaign(campaignId: string, data: Partial<Campaign>) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('User must be authenticated')
        }

        const { error } = await supabase
            .from('campaigns')
            .update({
                ...data,
                updated_at: new Date().toISOString()
            })
            .eq('id', campaignId)

        if (error) {
            console.error('Error updating campaign:', error)
            throw new Error(error.message)
        }

        return { success: true }
    } catch (error) {
        console.error('Unexpected error in updateCampaign:', error)
        throw error
    }
}

export async function deleteCampaign(campaignId: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('User must be authenticated')
        }

        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', campaignId)

        if (error) {
            console.error('Error deleting campaign:', error)
            throw new Error(error.message)
        }

        return { success: true }
    } catch (error) {
        console.error('Unexpected error in deleteCampaign:', error)
        throw error
    }
}
