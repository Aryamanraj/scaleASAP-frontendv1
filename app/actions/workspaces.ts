'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Workspace {
    id: string
    name: string
    role: string
    website: string
    favicon_url?: string
    onboarding_status: "incomplete" | "complete"
    user_id: string
    discovery_chat_history?: Array<{ role: 'user' | 'assistant', content: string }>
}

function filterSensitiveChatHistory(history: Array<{ role: string, content: string }> | undefined) {
    if (!history) return undefined

    return history.map(msg => {
        // Filter out JSON output blocks
        if (msg.content.includes('--- JSON_OUTPUT_START ---')) {
            // Keep only the text part before the JSON block if it exists
            const parts = msg.content.split('--- JSON_OUTPUT_START ---')
            return { ...msg, content: parts[0].trim() }
        }

        // Filter out raw JSON objects that might be exposed (heuristic: starts with { and likely ends with })
        // We only want to filter large automated JSON dumps, not necessarily small inline code snippets if user typed them.
        if (msg.content.trim().startsWith('{') && msg.content.trim().endsWith('}')) {
            try {
                JSON.parse(msg.content);
                // If it parses as JSON, it's likely a data dump we want to hide if it's from system/assistant
                if (msg.role === 'assistant') {
                    return { ...msg, content: '' } // Or completely filter out? For now empty content.
                }
            } catch (e) {
                // Not valid JSON, keep it
            }
        }

        return msg
    }).filter(msg => msg.content.length > 0) // Remove empty messages resulting from filtering
}

export async function createWorkspace(data: { name?: string }) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('createWorkspace: User not authenticated', authError)
            throw new Error('User must be authenticated to create a workspace')
        }

        const { data: workspace, error } = await supabase
            .from('workspaces')
            .insert({
                user_id: user.id,
                name: data.name || 'Untitled Workspace',
                onboarding_status: 'incomplete',
                role: 'Owner'
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating workspace:', error)
            throw new Error(error.message)
        }

        revalidatePath('/workspaces')
        return workspace
    } catch (error) {
        console.error('Unexpected error in createWorkspace:', error)
        throw error
    }
}

export async function getWorkspaces() {
    try {
        const supabase = await createClient()

        // Check for authenticated user first
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.log('getWorkspaces: No authenticated user found')
            return []
        }

        const { data: workspaces, error } = await supabase
            .from('workspaces')
            .select('*')
            .eq('user_id', user.id) // Enforce user_id check
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching workspaces:', error)
            return []
        }

        console.log(`getWorkspaces: Found ${workspaces?.length} workspaces for user ${user.id}`)

        // Filter chat history for all workspaces
        const safeWorkspaces = workspaces?.map(ws => ({
            ...ws,
            discovery_chat_history: filterSensitiveChatHistory(ws.discovery_chat_history)
        }))

        return safeWorkspaces as Workspace[]
    } catch (error) {
        console.error('Unexpected error in getWorkspaces:', error)
        return []
    }
}

export async function deleteWorkspace(id: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('User must be authenticated')
    }

    const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Enforce user_id check

    if (error) {
        console.error('Error deleting workspace:', error)
        throw new Error(error.message)
    }

    revalidatePath('/workspaces')
    return { success: true }
}

export async function updateWorkspace(id: string, data: Partial<Workspace>) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('User must be authenticated')
    }

    const { error } = await supabase
        .from('workspaces')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id) // Enforce user_id check

    if (error) {
        console.error('Error updating workspace:', error)
        throw new Error(error.message)
    }

    revalidatePath('/workspaces')
    return { success: true }
}

export async function getWorkspaceById(id: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return null
        }

        const { data: workspace, error } = await supabase
            .from('workspaces')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id) // Enforce user_id check
            .single()

        if (error) {
            console.error('Error fetching workspace by id:', error)
            return null
        }

        // Filter sensitive data from chat history
        const safeWorkspace = {
            ...workspace,
            discovery_chat_history: filterSensitiveChatHistory(workspace.discovery_chat_history)
        }

        return safeWorkspace as Workspace
    } catch (error) {
        console.error('Unexpected error in getWorkspaceById:', error)
        return null
    }
}

export async function saveDiscoveryChatHistory(workspaceId: string, history: Array<{ role: string, content: string }>) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('saveDiscoveryChatHistory: User not authenticated')
            throw new Error('User must be authenticated')
        }

        const { error } = await supabase
            .from('workspaces')
            .update({ discovery_chat_history: history })
            .eq('id', workspaceId)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error saving chat history:', error)
            throw new Error(error.message)
        }

        return { success: true }
    } catch (error) {
        console.error('Unexpected error in saveDiscoveryChatHistory:', error)
        throw error
    }
}

// Experiment-related types and actions
export interface Experiment {
    id: string
    workspace_id: string
    name: string
    type: 'bullseye' | 'variable_a' | 'variable_b' | 'contrarian' | 'long_shot'
    pattern: string
    industries: string[]
    pain: string
    trigger: string
    wiza_filters: {
        job_title?: Array<{ v: string, s?: string }>
        job_title_level?: string[]
        job_role?: string[]
        job_sub_role?: string[]
        location?: { v: string, b?: string, s?: string }
        skill?: string[]
        school?: string[]
        major?: string[]
        company_industry?: Array<{ v: string, s?: string }>
        company_size?: string[]
        company_annual_growth?: string
        department_size?: string[]
        revenue?: string[]
        funding_date?: { t: string, v: string }
        last_funding_min?: string
        last_funding_max?: string
        funding_min?: string
        funding_max?: string
        funding_stage?: { t: string, v: string[] }
        funding_type?: { t: string, v: string[] }
        company_type?: string[]
        company_summary?: Array<{ v: string, s?: string }>
        year_founded_start?: string
        year_founded_end?: string
    }
    outreach_angle: string
    status: 'pending' | 'creating_hypotheses' | 'finding_leads' | 'prioritizing_leads' | 'warmup_initiated' | 'complete' | 'completed' | 'failed'
    leads_found: number
    leads_warming: number
    meetings_booked: number
    created_at: string
    updated_at: string
}

export interface ICPData {
    name: string
    type: 'bullseye' | 'variable_a' | 'variable_b' | 'contrarian' | 'long_shot'
    pattern: string
    industries: string[]
    pain: string
    trigger: string
    wiza_filters: {
        job_title?: Array<{ v: string, s?: string }>
        job_title_level?: string[]
        job_role?: string[]
        job_sub_role?: string[]
        location?: { v: string, b?: string, s?: string }
        skill?: string[]
        school?: string[]
        major?: string[]
        company_industry?: Array<{ v: string, s?: string }>
        company_size?: string[]
        company_annual_growth?: string
        department_size?: string[]
        revenue?: string[]
        funding_date?: { t: string, v: string }
        last_funding_min?: string
        last_funding_max?: string
        funding_min?: string
        funding_max?: string
        funding_stage?: { t: string, v: string[] }
        funding_type?: { t: string, v: string[] }
        company_type?: string[]
        company_summary?: Array<{ v: string, s?: string }>
        year_founded_start?: string
        year_founded_end?: string
    }
    outreach_angle: string
}

export async function createExperiments(workspaceId: string, icps: ICPData[]) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('createExperiments: User not authenticated')
            throw new Error('User must be authenticated')
        }

        // Verify workspace belongs to user
        const { data: workspace, error: workspaceError } = await supabase
            .from('workspaces')
            .select('id')
            .eq('id', workspaceId)
            .eq('user_id', user.id)
            .single()

        if (workspaceError || !workspace) {
            throw new Error('Workspace not found or access denied')
        }

        // Create experiments from ICP data
        const experimentsToInsert = icps.map(icp => ({
            workspace_id: workspaceId,
            name: icp.name,
            type: icp.type,
            pattern: icp.pattern,
            industries: icp.industries,
            pain: icp.pain,
            trigger: icp.trigger,
            wiza_filters: icp.wiza_filters,
            outreach_angle: icp.outreach_angle,
            status: 'pending',
            leads_found: 0,
            leads_warming: 0,
            meetings_booked: 0
        }))

        const { data: experiments, error } = await supabase
            .from('experiments')
            .insert(experimentsToInsert)
            .select()

        if (error) {
            console.error('Error creating experiments:', error)
            throw new Error(error.message)
        }

        revalidatePath(`/dashboard/${workspaceId}`)
        return experiments as Experiment[]
    } catch (error) {
        console.error('Unexpected error in createExperiments:', error)
        throw error
    }
}

export async function getExperiments(workspaceId: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.log('getExperiments: No authenticated user')
            return []
        }

        const { data: experiments, error } = await supabase
            .from('experiments')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching experiments:', error)
            return []
        }

        return experiments as Experiment[]
    } catch (error) {
        console.error('Unexpected error in getExperiments:', error)
        return []
    }
}

export async function updateExperiment(experimentId: string, data: Partial<Experiment>) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('User must be authenticated')
        }

        const { error } = await supabase
            .from('experiments')
            .update({
                ...data,
                updated_at: new Date().toISOString()
            })
            .eq('id', experimentId)

        if (error) {
            console.error('Error updating experiment:', error)
            throw new Error(error.message)
        }

        return { success: true }
    } catch (error) {
        console.error('Unexpected error in updateExperiment:', error)
        throw error
    }
}

export async function getWorkspaceUserContext(workspaceId: string) {
    try {
        const { getOnboardingData } = await import('@/app/actions/onboarding')
        const context = await getOnboardingData(workspaceId)
        return context
    } catch (error) {
        console.error('Error fetching workspace user context:', error)
        return null
    }
}

export async function saveDiscoveryFeedback(workspaceId: string, rating: number, feedback?: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('User must be authenticated')
        }

        // For now, we'll try to insert into a discovery_feedback table.
        // If it doesn't exist, we'll log it and return success to not break the UI.
        const { error } = await supabase
            .from('discovery_feedback')
            .insert({
                workspace_id: workspaceId,
                user_id: user.id,
                rating,
                feedback: feedback || '',
                created_at: new Date().toISOString()
            })

        if (error) {
            console.warn('Could not save feedback to discovery_feedback table (it might not exist):', error.message)
            // Still return success to the UI
            return { success: true, warning: 'Table might not exist' }
        }

        return { success: true }
    } catch (error) {
        console.error('Unexpected error in saveDiscoveryFeedback:', error)
        // Return success anyway to not block the user
        return { success: true }
    }
}
