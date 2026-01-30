import { Lead } from '@/app/actions/leads'

export type LeadStatus = Lead['status']

export interface StatusConfig {
    label: string
    color: string
    bgColor: string
}

export const LEAD_STATUS_CONFIG: Record<LeadStatus, StatusConfig> = {
    found: {
        label: 'ANALYSING LEAD',
        color: '#4b5563',
        bgColor: 'bg-gray-50'
    },
    enriched: {
        label: 'ENRICHING LEAD',
        color: '#4b5563',
        bgColor: 'bg-blue-50'
    },
    drafted: {
        label: 'DRAFTING MESSAGE',
        color: '#4b5563',
        bgColor: 'bg-purple-50'
    },
    sent: {
        label: 'SENT',
        color: '#10B981',
        bgColor: 'bg-green-50'
    },
    responded: {
        label: 'RESPONDED',
        color: '#43B97B',
        bgColor: 'bg-green-100'
    }
}

export const LEAD_STATUS_SEQUENCE: LeadStatus[] = ['found', 'enriched', 'drafted', 'sent', 'responded']

export function getStatusSequence(targetStatus: LeadStatus): LeadStatus[] {
    const index = LEAD_STATUS_SEQUENCE.indexOf(targetStatus)
    if (index === -1) return [targetStatus]
    return LEAD_STATUS_SEQUENCE.slice(0, index + 1)
}
