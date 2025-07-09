"use client"
import { socketClient } from "../api/socket-client";
import { useEffect } from "react";
import { useUsersStore } from "./use-users-store";
import { useMessageStore } from "./use-message-store";
import { toast } from "sonner";
import { apiClient } from "@/api/api-client";
import { removeToken } from "@/lib/utils";
import { useLoaderStore } from "./use-loader";

export const useInit = () => {
    const { setUsers, setMe, selectedUser, selectedRoom, me, setRooms } = useUsersStore();
    const { setMessages, addMessage, messages } = useMessageStore();
    const { setLoading } = useLoaderStore()
    apiClient.addSetLoader(setLoading)

    const logout = () => {
        socketClient.disconnect();
        removeToken()
        setMessages([])
        setMe(undefined)
        setRooms([])
        setUsers([])
    }

    const init = () => {
        if (!me)
            socketClient.connect({
                onUsers: setUsers,
                onConnect: () => { },
                onDisconnect: () => { },
                onError: () => { },
                onPrivateMessage: (data) => {
                    addMessage({
                        id: Math.random().toString(),
                        text: data.message,
                        sender: {
                            id: data.from.userId,
                            email: data.from.email
                        },
                    });

                    toast(`Private message from ${data.from}`, {
                        description: data.message,
                    });
                },
                onRoomMessage: (data) => {
                    addMessage({
                        id: Math.random().toString(),
                        text: data.message,
                        sender: {
                            id: data.from.userId,
                            email: data.from.email
                        },
                    });

                    toast("Room message", {
                        description: data.message,
                    });
                },
                onMe: (data) => {
                    setMe(data)
                    apiClient.room.getRooms<Room[]>().then(resp => {
                        setRooms(resp)
                    })
                },
            });
    }

    useEffect(() => {
        return () => {
            socketClient.disconnect();
        };
    }, []);

    return { init, logout }
}