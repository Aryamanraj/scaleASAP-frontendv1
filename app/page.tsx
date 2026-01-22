"use client"

import { ArrowLongRightIcon } from "@heroicons/react/24/outline"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScaleLogo } from "@/components/scale-logo"
import { login, signup } from "@/app/actions/auth"
import { toast } from "sonner"

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null) // Clear previous errors
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const action = isSignUp ? signup : login
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
      } else {
        if (!isSignUp) {
          toast.success("Welcome back!")
        } else {
          toast.success("Account created! Please check your email to confirm.")
        }
      }
    })
  }

  return (
    <div className="flex h-dvh w-full items-center justify-center bg-white p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-[400px] shadow-none border-white bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight text-balance text-[#4A4A4A]">
            {isSignUp ? "Create an Account" : "Login to ScaleASAP"}
          </CardTitle>
          <CardDescription className="text-pretty">
            {isSignUp ? "Enter your email and password to create a new account." : "Enter your registered email and password to access your account."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className={error ? "text-red-500" : "text-[#4A4A4A]"}>Work Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className={error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-[#43B97B]"}
                onChange={() => setError(null)} // Clear error on typing
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className={error ? "text-red-500" : "text-[#4A4A4A]"}>Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className={error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-[#43B97B]"}
                onChange={() => setError(null)} // Clear error on typing
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-red-500">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-[#43B97B] hover:bg-[#3CA66F]" disabled={isPending} type="submit">
              {isPending
                ? (isSignUp ? "Creating account..." : "Signing in...")
                : (isSignUp ? "Sign Up" : "Sign in")}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <span
                className="text-[#43B97B] cursor-pointer hover:underline"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError(null)
                }}
              >
                {isSignUp ? "Login" : "Sign Up"}
              </span>
            </p>
          </CardFooter>
        </form>
      </Card>

      <div className="fixed bottom-4 left-0 right-0 flex w-full justify-between px-8 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <ScaleLogo className="h-2.5 w-auto" />
          <span>&copy; 2026 ScaleASAP</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#43B97B] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#43B97B] transition-colors">Terms & Condition</a>
          <a href="#" className="flex items-center gap-1 text-[#43B97B] hover:text-[#43B97B]/80 transition-colors">
            Request Access <ArrowLongRightIcon className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
