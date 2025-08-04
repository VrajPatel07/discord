import { Hash } from "lucide-react";
import UserAvatar from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "./ChatVideoButton";


interface ChatHeaderProps {
    serverId : string;
    name : string;
    type : "channel" | "conversation";
    imageUrl? : string
}


export default function ChatHeader({serverId, name, type, imageUrl} : ChatHeaderProps) {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-300 border-b-2">
        {
            type === "channel" && (
                <Hash className="w-5 h-5 text-zinc-400 mr-1" />
            )
        }
        {
            type === "conversation" && (
                <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8" />
            )
        }

        <p className="font-semibold text-md text-white ml-2">{name}</p>

        <div className="ml-auto flex items-center">
            {
                type === "conversation" && (
                    <ChatVideoButton />
                )
            }
            <SocketIndicator />
        </div>
    </div>
  )
}
