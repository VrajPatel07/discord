import { Hash } from "lucide-react";


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
        <p className="font-semibold text-md text-white">{name}</p>
    </div>
  )
}
