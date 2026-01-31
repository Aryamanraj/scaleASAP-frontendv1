"use client"

import { BuildingOfficeIcon, PlusIcon, ArrowLeftStartOnRectangleIcon, TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import NextImage from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { ScaleLogo } from "@/components/scale-logo"
import { createWorkspace, deleteWorkspace, getWorkspaces, Workspace } from "@/app/actions/workspaces"
import { logout, getUserEmail } from "@/app/actions/auth"
import { toast } from "sonner"

export default function WorkspacesPage() {
    const router = useRouter()

    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [userEmail, setUserEmail] = useState<string | null>(null)

    const userName = userEmail ? userEmail.split('@')[0] : ''
    const formattedName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : ''

    const loadWorkspaces = async () => {
        try {
            console.log("loadWorkspaces: Calling getWorkspaces()")
            const data = await getWorkspaces()
            console.log("loadWorkspaces: Received data:", JSON.stringify(data, null, 2))
            console.log("loadWorkspaces: Data length:", data?.length ?? 'null')
            setWorkspaces(data)
        } catch (error) {
            console.error("Failed to load workspaces:", error)
        }
    }

    useEffect(() => {
        const init = async () => {
            const email = await getUserEmail()
            setUserEmail(email)
            await loadWorkspaces()
        }
        init()
    }, [])

    const handleCreateWorkspace = async () => {
        startTransition(async () => {
            try {
                const newWorkspace = await createWorkspace({ name: "Untitled Workspace" })
                router.push(`/onboarding/${newWorkspace.id}`)
            } catch (error) {
                console.error("Failed to create workspace:", error)
                toast.error("Failed to create workspace")
            }
        })
    }

    const confirmDelete = async () => {
        if (!deleteId) return

        startTransition(async () => {
            try {
                // Clear local storage associated with this workspace
                localStorage.removeItem(`onboarding_data_${deleteId}`)
                localStorage.removeItem(`onboarding_step_${deleteId}`)
                localStorage.removeItem(`onboarding_completed_${deleteId}`)
                localStorage.removeItem(`onboarding_testmode_${deleteId}`)

                await deleteWorkspace(deleteId)
                setWorkspaces(prev => prev.filter(w => w.id !== deleteId))
                setDeleteId(null)
                toast.success("Workspace deleted")
            } catch (error) {
                console.error("Failed to delete workspace:", error)
                toast.error("Failed to delete workspace")
            }
        })
    }

    return (
        <div className="min-h-dvh w-full bg-white p-4 md:p-8 dark:bg-zinc-950 flex flex-col items-center">
            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <ExclamationTriangleIcon className="h-5 w-5" />
                            Delete Workspace
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this workspace? This action cannot be undone and all data associated with it will be permanently lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isPending}
                            className="bg-red-600 hover:bg-red-700 border-none ring-0 focus:ring-0 shadow-none outline-none"
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="w-full max-w-5xl space-y-8 mt-16">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-[#4A4A4A]">Select Workspace, {formattedName}</h1>
                    <p className="text-muted-foreground">Choose an organization to continue or create a new one.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Existing Workspaces */}
                    {workspaces.map((ws) => (
                        <Card key={ws.id} className="cursor-pointer hover:border-[#43B97B] transition-colors shadow-sm hover:shadow-md group flex flex-col">
                            <CardHeader className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#43B97B]/10 transition-colors h-10 w-10 flex items-center justify-center overflow-hidden shrink-0 relative">
                                        <BuildingOfficeIcon className="h-6 w-6 text-gray-500 group-hover:text-[#43B97B] transition-colors absolute inset-0 m-auto" />
                                        {(ws.favicon_url || ws.website) && (
                                            <img
                                                src={ws.favicon_url || `https://www.google.com/s2/favicons?domain=${ws.website?.replace('https://', '').replace('http://', '').split('/')[0]}&sz=128`}
                                                alt=""
                                                className="h-6 w-6 object-contain relative z-10 transition-opacity duration-300 bg-gray-100 rounded-sm"
                                            />
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setDeleteId(ws.id)
                                        }}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-xl pt-4 text-[#4A4A4A]">{ws.name}</CardTitle>
                                <CardDescription>{ws.website || "No website"}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="h-px w-full bg-gray-100" />
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2 pt-0">
                                {ws.onboarding_status === "incomplete" ? (
                                    <Button className="w-full" onClick={() => router.push(`/onboarding/${ws.id}`)}>
                                        Complete Onboarding
                                    </Button>
                                ) : (
                                    <div className="flex w-full gap-2">
                                        <Button variant="secondary" className="flex-1 text-[#4A4A4A] hover:text-[#43B97B]" onClick={() => router.push(`/dashboard/${ws.id}`)}>
                                            Enter Workspace
                                        </Button>
                                        <Button variant="ghost" className="flex-1 text-muted-foreground hover:text-[#4A4A4A]" onClick={() => router.push(`/onboarding/${ws.id}`)}>
                                            Edit Details
                                        </Button>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    ))}

                    {/* Create New Workspace */}
                    <Card
                        className="border-dashed border-2 hover:border-[#43B97B] hover:bg-gray-50/50 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[300px] shadow-none"
                        onClick={handleCreateWorkspace}
                    >
                        <CardContent className="flex flex-col items-center gap-4 py-8">
                            <div className="h-12 w-12 rounded-full bg-[#43B97B]/10 flex items-center justify-center">
                                {isPending ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#43B97B]" />
                                ) : (
                                    <PlusIcon className="h-6 w-6 text-[#43B97B]" />
                                )}
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="font-semibold text-[#4A4A4A]">Create New Workspace</h3>
                                <p className="text-sm text-muted-foreground">Start a new organization</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="fixed bottom-4 left-0 right-0 flex w-full justify-between px-8 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                    <ScaleLogo className="h-2.5 w-auto" />
                    <span>&copy; 2026 ScaleASAP</span>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-[#43B97B] transition-colors">Privacy</a>
                    <a href="#" className="hover:text-[#43B97B] transition-colors">Terms & Condition</a>
                    <button
                        onClick={async () => {
                            await logout()
                        }}
                        className="flex items-center gap-1 text-red-500 hover:text-red-500/80 transition-colors cursor-pointer"
                    >
                        Log Out <ArrowLeftStartOnRectangleIcon className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>
    )
}
