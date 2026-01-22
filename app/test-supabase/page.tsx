import { createClient } from '@/lib/supabase/server'

export default async function TestSupabasePage() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getSession()

    return (
        <div className="p-10 font-mono">
            <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>
            <div className="space-y-4">
                <div>
                    <strong>Status:</strong>{' '}
                    {error ? (
                        <span className="text-red-500">Error connecting</span>
                    ) : (
                        <span className="text-green-500">Connected successfully</span>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-100 text-red-800 rounded">
                        {error.message}
                    </div>
                )}

                {data && (
                    <div className="p-4 bg-gray-100 rounded">
                        <h2 className="font-bold mb-2">Auth Session Data:</h2>
                        <pre className="whitespace-pre-wrap break-all">{JSON.stringify(data, null, 2)}</pre>
                    </div>
                )}

                <div className="mt-8 border-t pt-8">
                    <h2 className="text-xl font-bold mb-4">Table Check: onboarding_data</h2>
                    <DatabaseCheck />
                </div>
            </div>
        </div>
    )
}

async function DatabaseCheck() {
    const supabase = await createClient()
    const { count, error } = await supabase
        .from('onboarding_data')
        .select('*', { count: 'exact', head: true })

    return (
        <div className="space-y-4">
            <div className="p-4 border rounded">
                <div className="mb-2">
                    <strong>Table: onboarding_data </strong>
                    {error ? (
                        <span className="text-red-500">
                            {error.code === '42P01' ? 'Table missing (Run SQL)' : `Error: ${error.message}`}
                            <br />
                            <span className="text-xs text-gray-500">Code: {error.code}</span>
                        </span>
                    ) : (
                        <span className="text-green-500">Found ({count} rows)</span>
                    )}
                </div>
            </div>

            <WorkspaceCheck />
        </div>
    )
}

async function WorkspaceCheck() {
    const supabase = await createClient()
    const { count, error } = await supabase
        .from('workspaces')
        .select('*', { count: 'exact', head: true })

    return (
        <div className="p-4 border rounded">
            <div className="mb-2">
                <strong>Table: workspaces </strong>
                {error ? (
                    <span className="text-red-500">
                        {error.code === '42P01' ? 'Table missing (Run SQL)' : `Error: ${error.message}`}
                        <br />
                        <span className="text-xs text-gray-500">Code: {error.code}</span>
                    </span>
                ) : (
                    <span className="text-green-500">Found ({count} rows)</span>
                )}
            </div>
        </div>
    )
}
