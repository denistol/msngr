"use client";
import { useUsersStore } from "@/hooks/use-users-store";
import { Button } from "./ui/button";
import { socketClient } from "@/api/socket-client";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { useMessageStore } from "@/hooks/use-message-store";
import { Toaster } from "@/components/ui/sonner";
import { MessagesWindow } from "./messages-window";
import { Plane } from "lucide-react";
import { RoomDialog } from "./room-dialog";
import { AppTabs } from "./app-tabs";
import { useInit } from "@/hooks/use-init";
import { AppLoader } from "./app-loader";
import { useLoaderStore } from "@/hooks/use-loader";

export const MainWindow: BaseComponent = () => {
    const { selectedUser, selectedRoom, me } = useUsersStore();
    const { addMessage } = useMessageStore();
    const { loading } = useLoaderStore()
    const { init } = useInit()
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (!me || !text.trim()) return;
        const id = Math.random().toString();
        if (selectedRoom) {
            socketClient.roomMessage(selectedRoom, text);
        }
        if (selectedUser) {
            socketClient.privateMessage(selectedUser, text);
        }
        addMessage({
            id,
            sender: { id: me.userId, email: me.email },
            text
        });
        setText("");
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    useEffect(() => { init() }, [])

    return (
        <main className="mx-auto border container my-2 flex p-2 rounded-md  flex-1 gap-2">
            <AppTabs />
            <div className="rounded-md flex-1 gap-2 flex flex-col relative">
                {loading && <AppLoader />}
                <MessagesWindow />
                <Textarea
                    onKeyDown={onKeyDown}
                    className="mt-auto"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                />
                <div className="flex gap-2">
                    <RoomDialog />
                    <Button onClick={handleSubmit}>
                        <Plane />
                        <span>Send</span>
                    </Button>

                </div>
            </div>
            <Toaster className="m-0 p-0" />
        </main>
    );
};
