'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ContentEngineService } from '@/lib/content-engine/service'

export interface Citation {
    source_name: string
    source_url: string
    source_logo_url?: string
}

export interface Signal {
    headline: string
    description: string
    citations: Citation[]
}

export interface Experience {
    company_name: string
    company_logo_url?: string
    title: string
    time_from: string
    time_to: string
}

export interface LeadEnrichment {
    signals: Signal[]
    experience: Experience[]
    summary: string
    phone?: string
    location?: string
    socials?: {
        platform: string
        url: string
        icon?: string
    }[]
}

export interface Lead {
    id: string
    campaign_id: string
    workspace_id: string
    full_name: string
    job_title?: string
    company?: string
    linkedin_url?: string
    email?: string
    enrichment_data?: LeadEnrichment
    outbound_message?: string
    outcome?: 'meeting_booked' | 'meeting_done' | 'closed' | 'rejected' | 'interested' | 'no_response'
    outcome_reason?: string
    status: 'found' | 'enriched' | 'drafted' | 'sent' | 'responded'
    created_at: string
    updated_at: string
    avatar_url?: string
}

const MOCK_LEADS: Lead[] = [
    {
        id: 'mock-1',
        campaign_id: 'mock-campaign',
        workspace_id: 'mock-workspace',
        full_name: 'Alexander Volkov',
        job_title: 'Founder & CEO',
        company: 'Volkov DSP',
        email: 'alex@volkovdsp.com',
        avatar_url: 'https://i.pravatar.cc/150?u=alex',
        linkedin_url: 'https://linkedin.com/in/alexvolkov',
        status: 'enriched',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        enrichment_data: {
            location: 'New York, NY',
            summary: 'Alexander is the founder of a rapidly scaling Amazon DSP with over 110 employees. His company recently expanded its fleet by 30%, indicating a critical need for streamlined back-office operations and fleet management efficiency—a core value prop for ScaleASAP.',
            signals: [
                {
                    headline: 'Rapid Fleet Expansion',
                    description: 'Volkov DSP recently added 35 new prime vans to their regional fleet, suggesting a significant increase in operational complexity and administrative overhead.',
                    citations: [
                        {
                            source_name: 'Logistics Insider',
                            source_url: 'https://example.com/volkov-expansion',
                            source_logo_url: 'https://www.google.com/s2/favicons?domain=logisticsinsider.com&sz=128'
                        }
                    ]
                },
                {
                    headline: 'Hiring 50+ New Drivers',
                    description: 'Public job listings show an aggressive hiring spree for delivery associates in the NYC metro area, typically a precursor to needing better routing and payroll automation.',
                    citations: [
                        {
                            source_name: 'Indeed',
                            source_url: 'https://example.com/indeed-volkov',
                            source_logo_url: 'https://www.google.com/s2/favicons?domain=indeed.com&sz=128'
                        }
                    ]
                }
            ],
            experience: [
                {
                    company_name: 'Volkov DSP',
                    title: 'Founder & CEO',
                    time_from: '2019',
                    time_to: 'Present',
                    company_logo_url: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128'
                },
                {
                    company_name: 'Logistics Pro',
                    title: 'Operations Manager',
                    time_from: '2015',
                    time_to: '2019',
                    company_logo_url: 'https://www.google.com/s2/favicons?domain=ups.com&sz=128'
                }
            ]
        }
    },
    {
        id: 'mock-2',
        campaign_id: 'mock-campaign',
        workspace_id: 'mock-workspace',
        full_name: 'Sarah Jenkins',
        job_title: 'Director of Logistics',
        company: 'SwiftPath Delivery',
        email: 's.jenkins@swiftpath.io',
        avatar_url: 'https://i.pravatar.cc/150?u=sarah',
        linkedin_url: 'https://linkedin.com/in/sjenkins',
        status: 'enriched',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        enrichment_data: {
            location: 'Austin, TX',
            summary: 'Sarah oversees operations for one of the top-performing DSPs in the Texas region. They are currently transitioning to a new hub, creating an immediate window for implementing more robust digital infrastructure for their 85-person team.',
            signals: [
                {
                    headline: 'Regional Hub Relocation',
                    description: 'SwiftPath is moving into a 50,000 sq ft facility in Austin to centralize their growing regional operations.',
                    citations: [
                        {
                            source_name: 'Business Journal',
                            source_url: 'https://example.com/swiftpath-move',
                            source_logo_url: 'https://www.google.com/s2/favicons?domain=bizjournals.com&sz=128'
                        }
                    ]
                }
            ],
            experience: [
                {
                    company_name: 'SwiftPath Delivery',
                    title: 'Director of Logistics',
                    time_from: '2021',
                    time_to: 'Present',
                    company_logo_url: 'https://www.google.com/s2/favicons?domain=fedex.com&sz=128'
                }
            ]
        }
    }
]

export async function getLeads(campaignId: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.log('getLeads: No authenticated user')
            return []
        }

        const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .eq('campaign_id', campaignId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching leads:', error)
            return []
        }

        // Return mock data if no leads found, for demo purposes
        if (!leads || leads.length === 0) {
            return MOCK_LEADS.map(l => ({ ...l, campaign_id: campaignId }))
        }

        return leads as Lead[]
    } catch (error) {
        console.error('Unexpected error in getLeads:', error)
        return []
    }
}

export async function getAllLeads(workspaceId: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.log('getAllLeads: No authenticated user')
            return []
        }

        const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching all leads:', error)
            return []
        }

        // Return mock data ONLY if no real leads found and we are in a demo/dev environment
        // For now, let's keep it consistent with getLeads
        if (!leads || leads.length === 0) {
            return MOCK_LEADS.map(l => ({ ...l, workspace_id: workspaceId }))
        }

        return leads as Lead[]
    } catch (error) {
        console.error('Unexpected error in getAllLeads:', error)
        return []
    }
}

export async function addLeads(campaignId: string, workspaceId: string, leads: Partial<Lead>[]) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('User must be authenticated')
        }

        const leadsToInsert = leads.map(lead => ({
            ...lead,
            campaign_id: campaignId,
            workspace_id: workspaceId,
            status: lead.status || 'found'
        }))

        const { data, error } = await supabase
            .from('leads')
            .insert(leadsToInsert)
            .select()

        if (error) {
            console.error('Error adding leads:', error)
            throw new Error(error.message)
        }

        return data as Lead[]
    } catch (error) {
        console.error('Unexpected error in addLeads:', error)
        throw error
    }
}

export async function updateLead(leadId: string, data: Partial<Lead>) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('User must be authenticated')
        }

        const { error } = await supabase
            .from('leads')
            .update({
                ...data,
                updated_at: new Date().toISOString()
            })
            .eq('id', leadId)

        if (error) {
            console.error('Error updating lead:', error)
            throw new Error(error.message)
        }

        return { success: true }
    } catch (error) {
        console.error('Unexpected error in updateLead:', error)
        throw error
    }
}

export async function logLeadOutcome(leadId: string, outcome: Lead['outcome'], reason?: string) {
    return updateLead(leadId, { outcome, outcome_reason: reason })
}

export async function generateOutreachAction(lead: Lead, config: { format: string, isFollowUp: boolean }) {
    try {
        // Fetch or use mock business context
        const business = ContentEngineService.getShipSyncContext();

        const prospect = {
            firstName: lead.full_name.split(' ')[0],
            lastName: lead.full_name.split(' ').slice(1).join(' '),
            role: lead.job_title || 'Professional',
            company: lead.company || 'Their Company',
            fullProfile: lead.enrichment_data?.summary || '',
            rawActivity: lead.enrichment_data?.signals?.map(s => s.description).join('\n') || '',
            icpCategory: 'Target Logistics'
        };

        const fit = {
            logicalConnection: lead.enrichment_data?.summary || 'Good fit based on role and company.',
            warmthLevel: config.isFollowUp ? 'follow_up' : 'cold',
            shouldProceed: true
        };

        const result = await ContentEngineService.generateOutreach({
            business,
            prospect,
            fit
        });

        // Potentially save the generated message to the lead
        await updateLead(lead.id, { outbound_message: result.followUpDM });

        return result;
    } catch (error) {
        console.error('Error generating outreach:', error)
        throw error
    }
}
