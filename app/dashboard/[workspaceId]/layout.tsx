import { Metadata } from 'next'
import { getWorkspaceById } from '@/app/actions/workspaces'

type Props = {
    children: React.ReactNode
    params: Promise<{ workspaceId: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ workspaceId: string }> }): Promise<Metadata> {
    const { workspaceId } = await params
    const workspace = await getWorkspaceById(workspaceId)

    if (!workspace) {
        return {
            title: 'Workspace Not Found | ScaleASAP',
        }
    }

    let iconUrl = workspace.favicon_url

    if (!iconUrl && workspace.website) {
        try {
            const domain = workspace.website.replace('https://', '').replace('http://', '').split('/')[0]
            iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        } catch {
            // ignore parsing errors
        }
    }

    return {
        title: `${workspace.name} | GTM Workspace`,
        icons: {
            icon: iconUrl || 'https://pub-3d3b224ee6544903a80a5051e75e33a4.r2.dev/BLUE_BG.png',
        },
    }
}

export default function WorkspaceLayout({ children }: Props) {
    return (
        <>
            {children}
        </>
    )
}
