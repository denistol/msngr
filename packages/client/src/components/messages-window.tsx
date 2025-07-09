import { useMessageStore } from "@/hooks/use-message-store";
import { MessageBox } from "./message-box";
import { useRef } from "react";
import { useEffect } from "react";

export const MessagesWindow: BaseComponent = () => {
    const { messages } = useMessageStore()
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTo({ top: 99999 })
        }
    }, [messages])
    return (
        <div ref={ref} id="message-window"
            className="flex flex-col gap-1 border flex-1 rounded-md p-2 overflow-y-auto max-h-[calc(100dvh-15rem)] h-[calc(100dvh-15rem)] bg-muted">

            {
                messages.map(m => <MessageBox key={m.id + m.sender.id} message={m} />)
            }
        </div>
    )
}