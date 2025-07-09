import { FC, PropsWithChildren } from "react";

declare global {
  type BaseProps = {
    className?: string;
  };

  type BaseComponent<P = {}> = FC<PropsWithChildren<P & BaseProps>>;

  type SocketUser = {
    email: string
    userId: string
    socketId: string
  }

  type Message = {
    sender: {id: string, email: string}
    text: string,
    id: string
  }

  type Room = {
    id: string
    name: string
  }
  
}