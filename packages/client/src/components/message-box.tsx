import { Avatar } from "./avatar";
import { useUsersStore } from "@/hooks/use-users-store";
import { cn } from "@/lib/utils";

export const MessageBox: BaseComponent<{ message: Message }> = ({ message }) => {
    const { me } = useUsersStore();
    const isSelfMessage = message.sender.id === me?.userId;

    return (
        <div className={cn("flex flex-col gap-1 mb-4 last:mb-0", { 'ml-auto': isSelfMessage })}>

            <div className={cn("flex  gap-1 items-center text-sm", {'ml-auto': isSelfMessage, 'flex-row-reverse': isSelfMessage})}>
                <Avatar className="w-4 h-4" seed={message.sender.id} />
                {
                    <div className="font-semibold">{message.sender.email || message.sender.id}</div>
                }
                
            </div>

            <div className={cn("relative", {
                'ml-auto': isSelfMessage,
                'mr-auto': !isSelfMessage,
            })}>
                <div className=" text-sm bg-background rounded-md shadow-sm w-full  py-3 px-4">
                    {message.text}
                </div>
            </div>
        </div>
    );
};
