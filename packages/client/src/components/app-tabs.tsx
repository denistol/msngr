import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useUsersStore } from "@/hooks/use-users-store"
import { Avatar } from "./avatar"
import { useEffect } from "react"
import { apiClient } from "@/api/api-client"
import { cn } from "@/lib/utils"
import { useMessageStore } from "@/hooks/use-message-store"
import { Activity, User } from "lucide-react"
import { socketClient } from "@/api/socket-client"
import { useLoaderStore } from "@/hooks/use-loader"

export const AppTabs: BaseComponent = () => {
    const { users, selectUser, selectRoom, selectedRoom, selectedUser, setRooms, rooms, me } = useUsersStore()
    const { setMessages } = useMessageStore()
    const { setLoading } = useLoaderStore()

    const otherUser = users.filter(user => user.userId !== me?.userId)

    apiClient.addSetLoader(setLoading)

    useEffect(() => {
        if (selectedUser) {
            apiClient.message.getUserMessages<Message[]>(selectedUser.userId)
                .then(messages => {
                    setMessages(messages)
                })
        }
        if (selectedRoom) {
            apiClient.message.getRoomMessages<Message[]>(selectedRoom)
                .then(messages => {
                    setMessages(messages)
                })
        }
    }, [selectedUser, selectedRoom, setMessages])

    return (
        <div className="flex w-[180px] max-w-sm flex-col h-full">
            <Tabs defaultValue="Rooms">

                <TabsList className="p-0 m-0 w-full">
                    <TabsTrigger value="Rooms">
                        <Activity />
                        Rooms
                    </TabsTrigger>
                    <TabsTrigger value="Users">
                        <User />
                        Users
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="Rooms">
                    <div className="flex flex-col gap-2 flex-wrap h-full flex-1 mt-2 max-h-[calc(100dvh-17rem)] rounded-md overflow-y-auto">
                        {rooms.map(el => <div
                            onClick={() => {
                                socketClient.joinRoom(el)
                                selectRoom(el)
                                setMessages([])
                            }}
                            className={cn("flex gap-2 items-center text-sm rounded-md px-4 py-3 cursor-pointer bg-muted transition-colors", {
                                'bg-foreground text-background': selectedRoom?.id === el.id
                            })}
                            key={el.name}>
                            <span>#{el.name}</span>
                        </div>)}
                    </div>
                </TabsContent>

                <TabsContent value="Users">
                    <div className="flex flex-col gap-2 flex-wrap h-full flex-1 mt-2 max-h-[calc(100dvh-17rem)] rounded-md overflow-y-auto">
                        {otherUser.map(el => <div
                            onClick={() => {
                                selectUser(el)
                                setMessages([])
                            }}
                            className={cn("flex gap-2 items-center text-sm rounded-md px-2 py-1 cursor-pointer bg-muted transition-colors", {
                                'bg-foreground text-background': selectedUser?.email === el.email
                            })}
                            key={el.email}>
                            <Avatar seed={el.email} /><span>{el.email}</span>
                        </div>)}
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    )
}
