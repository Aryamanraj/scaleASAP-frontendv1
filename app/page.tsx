"use client"

import { ArrowLongRightIcon } from "@heroicons/react/24/outline"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScaleLogo } from "@/components/scale-logo"
import { login, signup, signInWithGoogle } from "@/app/actions/auth"
import { toast } from "sonner"

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onGoogleSignIn() {
    startTransition(async () => {
      const result = await signInWithGoogle()
      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

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

            <div className="relative w-full my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-medium">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full border-gray-200 hover:bg-gray-50 text-[#4A4A4A] flex items-center justify-center gap-2"
              onClick={onGoogleSignIn}
              disabled={isPending}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-2">
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
