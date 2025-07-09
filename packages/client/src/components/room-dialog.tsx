"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useUsersStore } from "@/hooks/use-users-store"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { apiClient } from "@/api/api-client"
import { toast } from "sonner"
import { useLoaderStore } from "@/hooks/use-loader"

const roomSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 1 characters" }),
})

type RoomData = z.infer<typeof roomSchema>

export const RoomDialog: BaseComponent = () => {
  const [open, setOpen] = useState(false)
  const { setRooms } = useUsersStore()
  const { setLoading } = useLoaderStore()
  apiClient.addSetLoader(setLoading)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<RoomData>({
    resolver: zodResolver(roomSchema),
    mode: "onChange"
  })

  const onSubmit = async (data: RoomData) => {

    await apiClient.room.create<{ data: Room }>(data.name)
    const newRooms = await apiClient.room.getRooms<Room[]>()

    toast(`Room ${data.name} created!`)
    setRooms(newRooms)
    setOpen(false)

  }
  const isSubmitDisabled = useMemo(() => {
    return !isValid || Object.values(watch()).some(v => !v)
  }, [watch(), isValid])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="light cursor-pointer">Create room</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create new room</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input placeholder="Enter room name" id="name" type="text" {...register("name")} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <div className="flex flex-col gap-2 w-full">
              <Button disabled={isSubmitDisabled} type="submit">Create</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
