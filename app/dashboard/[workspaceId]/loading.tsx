export default function DashboardLoading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#43B97B]" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Entering Workspace...</p>
            </div>
        </div>
    )
}
