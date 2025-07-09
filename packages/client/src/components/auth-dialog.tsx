"use client"

import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUsersStore } from "@/hooks/use-users-store"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { apiClient } from "@/api/api-client"
import { toast } from "sonner"
import { useInit } from "../hooks/use-init"
import { setToken } from "@/lib/utils"
import { useLoaderStore } from "@/hooks/use-loader"

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const signUpSchema = signInSchema.extend({
  passwordRepeat: z.string().min(6, { message: "Repeat your password" }),
}).refine((data) => data.password === data.passwordRepeat, {
  message: "Passwords don't match",
  path: ["passwordRepeat"],
})

type SignInData = z.infer<typeof signInSchema>
type SignUpData = z.infer<typeof signUpSchema>

export const LoginDialog: BaseComponent = () => {
  const { me } = useUsersStore()
  const [signUp, setSignUp] = useState(false)
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<SignInData | SignUpData>({
    resolver: zodResolver(signUp ? signUpSchema : signInSchema),
    mode: "onChange"
  })

  const { init, logout } = useInit()
  const { setLoading } = useLoaderStore()
  apiClient.addSetLoader(setLoading)

  const onSubmit = (data: SignInData | SignUpData) => {
    if (!signUp) {
      apiClient.auth.login<{ data: { token: string } }>({ email: data.email, password: data.password })
        .then((data) => {
          setToken(data.data.token)
          toast('Sign In Success!')
          setSignUp(false)
          setOpen(false)
          init()
        })
    } else {
      apiClient.auth.register({ email: data.email, password: data.password })
        .then(() => {
          toast('Sign Up Success!')
          setSignUp(false)
        })
    }
  }

  const toggleSignUp = () => {
    reset()
    setSignUp((p) => !p)
  }

  const isSubmitDisabled = useMemo(() => {
    return !isValid || Object.values(watch()).some(v => !v)
  }, [watch(), isValid])

  const title = signUp ? "Sign Up" : "Sign In"
  const titleToggle = !signUp ? "Sign Up" : "Sign In"
  const description = signUp
    ? "Join MSNGR — create your account now"
    : "Sign In to MSNGR now"

  if (me) {
    return <Button onClick={() => {
      logout()
    }}>Sign Out ({me.email})</Button>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="light cursor-pointer">Sign In</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            {signUp && (
              <div className="grid gap-2">
                <Label htmlFor="passwordRepeat">Repeat Password</Label>
                <Input id="passwordRepeat" type="password" {...register("passwordRepeat")} />
                {"passwordRepeat" in errors && (
                  <p className="text-red-500 text-xs">
                    {(errors as {passwordRepeat: {message: string}})?.passwordRepeat?.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex flex-col gap-2 w-full">
              <Button disabled={isSubmitDisabled} type="submit">{title}</Button>
              <Button
                type="button"
                className="w-min mx-auto text-xs"
                variant="ghost"
                onClick={toggleSignUp}
              >
                {titleToggle}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
