'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login error:', error.message)

        // If the error is due to unconfirmed email, try to auto-confirm if we have admin access
        if (error.message.includes('Email not confirmed') && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.log('Attempting to auto-confirm user...')
            try {
                const adminClient = await createAdminClient()
                // We need the user ID to update, but we only have email. 
                // Admin listUsers can find it, or we can just try to update by email if possible?
                // limit to 1 user by email
                const { data: { users } } = await adminClient.auth.admin.listUsers()

                const user = users?.find(u => u.email === email)

                if (user) {
                    const { error: updateError } = await adminClient.auth.admin.updateUserById(
                        user.id,
                        { email_confirm: true }
                    )

                    if (!updateError) {
                        console.log('User auto-confirmed. Retrying login...')
                        const { error: retryError } = await supabase.auth.signInWithPassword({
                            email,
                            password,
                        })

                        if (retryError) {
                            return { error: retryError.message }
                        }
                    } else {
                        console.error('Failed to auto-confirm user:', updateError.message)
                        return { error: error.message }
                    }
                }
            } catch (err) {
                console.error('Admin operation failed:', err)
                return { error: error.message }
            }
        } else {
            // Debug: Check if user exists but password is wrong
            if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
                try {
                    const adminClient = await createAdminClient()
                    const { data: { users } } = await adminClient.auth.admin.listUsers()
                    const user = users?.find(u => u.email === email)

                    if (user) {
                        console.log('DEBUG: User exists:', {
                            id: user.id,
                            email: user.email,
                            confirmed_at: user.email_confirmed_at,
                            last_sign_in: user.last_sign_in_at
                        })

                        // Return a more descriptive error
                        return { error: `Login failed. User exists (Confirmed: ${!!user.email_confirmed_at}). Verify password.` }
                    } else {
                        console.log('DEBUG: User does not exist in Auth table.')
                        return { error: 'User does not exist. Please sign up.' }
                    }
                } catch (e) {
                    console.error('Debug verify failed:', e)
                }
            }

            return { error: error.message }
        }
    }

    console.log('Login successful for:', email)

    revalidatePath('/', 'layout')
    redirect('/workspaces')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('Attempting signup for:', email)

    // Use admin signup if available to auto-confirm email
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
            const adminClient = await createAdminClient()
            const { error } = await adminClient.auth.admin.createUser({
                email,
                password,
                email_confirm: true
            })

            if (error) {
                // If user already exists, return specific error
                if (error.message.includes('already registered')) {
                    return { error: 'User already exists. Please login instead.' }
                }
                console.error('Admin signup error:', error.message)
                return { error: error.message }
            }

            console.log('Admin signup successful, user auto-confirmed')

            // Sign in to establish session
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (signInError) {
                console.error('Sign in after signup failed:', signInError.message)
                return { error: signInError.message }
            }

            revalidatePath('/', 'layout')
            redirect('/workspaces')
        } catch (e) {
            console.error('Admin signup failed:', e)
            return { error: 'Signup failed. Please try again.' }
        }
    }

    // Fallback to regular signup (requires email confirmation)
    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        if (error.message.includes('already registered')) {
            return { error: 'User already exists. Please login instead.' }
        }
        console.error('Signup error:', error.message)
        return { error: error.message }
    }

    console.log('Signup successful. Please check email for confirmation.')
    return { success: true, message: 'Please check your email to confirm your account.' }
}

export async function getUserEmail() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.email || null
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        console.error('Google sign in error:', error.message)
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
