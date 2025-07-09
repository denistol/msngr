import { create } from "zustand";


type MessageState = {
    messages: Message[],
    viewedMessages: Message[];
    viewMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void

};

export const useMessageStore = create<MessageState>((set, get) => ({
    messages: [],
    viewedMessages: [],
    setMessages: (messages) => {
        set({messages})
    },
    addMessage: (message) => {
        const {messages} = get()
        set({messages: [...messages, message]})
    },
    viewMessage: (message) => {
        const { viewedMessages } = get();
        if (!viewedMessages.find(el => el.id === message.id)) {
            set({ viewedMessages: [...viewedMessages, message] });
        }
    },
}));
