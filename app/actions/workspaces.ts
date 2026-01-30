'use server'

import { revalidatePath } from 'next/cache'
import {
    serverGetWorkspaces,
    serverGetWorkspaceById,
    serverCreateWorkspace,
    serverUpdateWorkspace,
    serverDeleteWorkspace,
    serverUpdateDiscoveryChatHistory,
    serverSaveDiscoveryFeedback,
    ServerApiError,
    type WorkspaceResponse,
} from '@/lib/api/server-workspaces'
import {
    serverGetExperiments,
    serverCreateExperimentsBatch,
    serverUpdateExperiment,
    type ExperimentResponse,
    type CreateExperimentRequest,
} from '@/lib/api/server-experiments'

// ============================================================================
// Frontend Types (use string IDs for URL compatibility)
// ============================================================================

export interface Workspace {
    id: string  // String for URL params, but numeric in backend
    name: string
    role: string
    website: string
    favicon_url?: string
    onboarding_status: "incomplete" | "complete"
    user_id: string
    discovery_chat_history?: Array<{ role: 'user' | 'assistant', content: string }>
}

export interface Experiment {
    id: string
    workspace_id: string
    name: string
    type: 'bullseye' | 'variable_a' | 'variable_b' | 'contrarian' | 'long_shot'
    pattern: string
    industries: string[]
    pain: string
    trigger: string
    wiza_filters: WizaFilters
    outreach_angle: string
    status: 'pending' | 'creating_hypotheses' | 'finding_leads' | 'prioritizing_leads' | 'warmup_initiated' | 'complete' | 'completed' | 'failed'
    leads_found: number
    leads_warming: number
    meetings_booked: number
    created_at: string
    updated_at: string
}

export interface WizaFilters {
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

export interface ICPData {
    name: string
    type: 'bullseye' | 'variable_a' | 'variable_b' | 'contrarian' | 'long_shot'
    pattern: string
    industries: string[]
    pain: string
    trigger: string
    wiza_filters: WizaFilters
    outreach_angle: string
}

// ============================================================================
// Helpers
// ============================================================================

function filterSensitiveChatHistory(history: Array<{ role: string, content: string }> | undefined): Array<{ role: 'user' | 'assistant', content: string }> | undefined {
    if (!history) return undefined

    return history.map(msg => {
        // Filter out JSON output blocks
        if (msg.content.includes('--- JSON_OUTPUT_START ---')) {
            const parts = msg.content.split('--- JSON_OUTPUT_START ---')
            return { role: msg.role as 'user' | 'assistant', content: parts[0].trim() }
        }

        // Filter out raw JSON objects from assistant messages
        if (msg.content.trim().startsWith('{') && msg.content.trim().endsWith('}')) {
            try {
                JSON.parse(msg.content);
                if (msg.role === 'assistant') {
                    return { role: msg.role as 'user' | 'assistant', content: '' }
                }
            } catch {
                // Not valid JSON, keep it
            }
        }

        return { role: msg.role as 'user' | 'assistant', content: msg.content }
    }).filter(msg => msg.content.length > 0)
}

function mapWorkspaceToFrontend(ws: WorkspaceResponse): Workspace {
    return {
        id: String(ws.id),
        name: ws.name,
        role: 'Owner', // Default role for owner
        website: ws.website || '',
        favicon_url: ws.faviconUrl,
        onboarding_status: ws.onboardingStatus as "incomplete" | "complete",
        user_id: String(ws.ownerUserId || 0),
        discovery_chat_history: filterSensitiveChatHistory(ws.discoveryChatHistory),
    }
}

function mapExperimentToFrontend(exp: ExperimentResponse): Experiment {
    return {
        id: String(exp.ExperimentID),
        workspace_id: String(exp.ProjectID),
        name: exp.Name,
        type: exp.Type,
        pattern: exp.Pattern || '',
        industries: (exp.Industries as string[]) || [],
        pain: exp.Pain || '',
        trigger: exp.Trigger || '',
        wiza_filters: (exp.WizaFilters as WizaFilters) || {},
        outreach_angle: exp.OutreachAngle || '',
        status: exp.Status,
        leads_found: exp.LeadsFound,
        leads_warming: exp.LeadsWarming,
        meetings_booked: exp.MeetingsBooked,
        created_at: exp.CreatedAt,
        updated_at: exp.UpdatedAt,
    }
}

// ============================================================================
// Workspace Actions
// ============================================================================

export async function createWorkspace(data: { name?: string }) {
    try {
        console.log('createWorkspace: Using backend API')
        const workspace = await serverCreateWorkspace({
            name: data.name || 'Untitled Workspace',
        })

        revalidatePath('/workspaces')
        return mapWorkspaceToFrontend(workspace)
    } catch (error) {
        console.error('Unexpected error in createWorkspace:', error)
        if (error instanceof ServerApiError) {
            throw new Error(error.message)
        }
        throw error
    }
}

export async function getWorkspaces() {
    try {
        const workspaces = await serverGetWorkspaces()
        console.log(`getWorkspaces: Found ${workspaces.length} workspaces via backend API`)
        return workspaces.map(mapWorkspaceToFrontend)
    } catch (error) {
        console.error('Unexpected error in getWorkspaces:', error)
        return []
    }
}

export async function deleteWorkspace(id: string) {
    try {
        await serverDeleteWorkspace(Number(id))
        revalidatePath('/workspaces')
        return { success: true }
    } catch (error) {
        console.error('Error deleting workspace:', error)
        if (error instanceof ServerApiError) {
            throw new Error(error.message)
        }
        throw error
    }
}

export async function updateWorkspace(id: string, data: Partial<Workspace>) {
    try {
        const updateData: Parameters<typeof serverUpdateWorkspace>[1] = {}
        if (data.name !== undefined) updateData.name = data.name
        if (data.website !== undefined) updateData.website = data.website
        if (data.onboarding_status !== undefined) updateData.onboardingStatus = data.onboarding_status
        if (data.favicon_url !== undefined) updateData.faviconUrl = data.favicon_url

        await serverUpdateWorkspace(Number(id), updateData)
        revalidatePath('/workspaces')
        return { success: true }
    } catch (error) {
        console.error('Error updating workspace:', error)
        if (error instanceof ServerApiError) {
            throw new Error(error.message)
        }
        throw error
    }
}

export async function getWorkspaceById(id: string) {
    try {
        const workspace = await serverGetWorkspaceById(Number(id))
        return mapWorkspaceToFrontend(workspace)
    } catch (error) {
        console.error('Error fetching workspace by id:', error)
        return null
    }
}

// ============================================================================
// Discovery Chat Actions
// ============================================================================

export async function saveDiscoveryChatHistory(workspaceId: string, history: Array<{ role: string, content: string }>) {
    try {
        await serverUpdateDiscoveryChatHistory(
            Number(workspaceId),
            history as Array<{ role: 'user' | 'assistant', content: string }>
        )
        return { success: true }
    } catch (error) {
        console.error('Unexpected error in saveDiscoveryChatHistory:', error)
        throw error
    }
}

export async function saveDiscoveryFeedback(workspaceId: string, rating: number, feedback?: string) {
    try {
        await serverSaveDiscoveryFeedback(Number(workspaceId), rating, feedback)
        return { success: true }
    } catch (error) {
        console.error('Unexpected error in saveDiscoveryFeedback:', error)
        // Return success anyway to not block the user
        return { success: true }
    }
}

// ============================================================================
// Experiment Actions
// ============================================================================

export async function createExperiments(workspaceId: string, icps: ICPData[]) {
    try {
        const experiments = icps.map(icp => ({
            name: icp.name,
            type: icp.type,
            pattern: icp.pattern,
            industries: icp.industries,
            pain: icp.pain,
            trigger: icp.trigger,
            wizaFilters: icp.wiza_filters,
            outreachAngle: icp.outreach_angle,
        } as CreateExperimentRequest))

        const created = await serverCreateExperimentsBatch(Number(workspaceId), experiments)
        
        revalidatePath(`/dashboard/${workspaceId}`)
        return created.map(mapExperimentToFrontend)
    } catch (error) {
        console.error('Unexpected error in createExperiments:', error)
        throw error
    }
}

export async function getExperiments(workspaceId: string) {
    try {
        const experiments = await serverGetExperiments(Number(workspaceId))
        return experiments.map(mapExperimentToFrontend)
    } catch (error) {
        console.error('Unexpected error in getExperiments:', error)
        return []
    }
}

export async function updateExperiment(experimentId: string, data: Partial<Experiment>) {
    try {
        const updateData: Parameters<typeof serverUpdateExperiment>[1] = {}
        if (data.name !== undefined) updateData.name = data.name
        if (data.pattern !== undefined) updateData.pattern = data.pattern
        if (data.industries !== undefined) updateData.industries = data.industries
        if (data.pain !== undefined) updateData.pain = data.pain
        if (data.trigger !== undefined) updateData.trigger = data.trigger
        if (data.wiza_filters !== undefined) updateData.wizaFilters = data.wiza_filters
        if (data.outreach_angle !== undefined) updateData.outreachAngle = data.outreach_angle
        if (data.status !== undefined) updateData.status = data.status

        await serverUpdateExperiment(Number(experimentId), updateData)
        return { success: true }
    } catch (error) {
        console.error('Unexpected error in updateExperiment:', error)
        throw error
    }
}

// ============================================================================
// Utility Actions
// ============================================================================

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
