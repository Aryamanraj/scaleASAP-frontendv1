'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface GeneratedMessage {
    id: string
    lead_id: string
    platform: 'linkedin' | 'email'
    message_type: string
    content: string
    context?: string
    thinking?: string
    timestamp: string
    created_at: string
}

export async function getGeneratedMessages(leadId: string): Promise<GeneratedMessage[]> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.log('getGeneratedMessages: No authenticated user')
            return []
        }

        const { data: messages, error } = await supabase
            .from('generated_messages')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching generated messages:', error)
            return []
        }

        return (messages || []) as GeneratedMessage[]
    } catch (error) {
        console.error('Unexpected error in getGeneratedMessages:', error)
        return []
    }
}

export async function saveGeneratedMessage(data: Omit<GeneratedMessage, 'id' | 'created_at'>): Promise<GeneratedMessage | null> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('User must be authenticated')
        }

        const { data: message, error } = await supabase
            .from('generated_messages')
            .insert(data)
            .select()
            .single()

        if (error) {
            console.error('Error saving generated message:', error)
            throw new Error(error.message)
        }

        revalidatePath('/dashboard')
        return message as GeneratedMessage
    } catch (error) {
        console.error('Unexpected error in saveGeneratedMessage:', error)
        throw error
    }
}

export async function deleteGeneratedMessage(messageId: string): Promise<{ success: boolean }> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('User must be authenticated')
        }

        const { error } = await supabase
            .from('generated_messages')
            .delete()
            .eq('id', messageId)

        if (error) {
            console.error('Error deleting generated message:', error)
            throw new Error(error.message)
        }

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Unexpected error in deleteGeneratedMessage:', error)
        throw error
    }
}
