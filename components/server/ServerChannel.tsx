"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { ModelType, useModel } from "@/hooks/useModelStore";



interface ServerChannelProps {
    channel : Channel;
    server : Server;
    role? : MemberRole
}


const iconMap = {
    [ChannelType.TEXT] : Hash,
    [ChannelType.AUDIO] : Mic,
    [ChannelType.VIDEO] : Video
}


const ServerChannel = ({channel, server, role} : ServerChannelProps) => {

    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[channel.type];

    const {onOpen} = useModel();

    const clickHandler = () => {
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
    }

    const onAction = (e : React.MouseEvent, action : ModelType) => {
        e.stopPropagation();
        onOpen(action, {server : server, channel : channel});
    }

    return (
        <button
            onClick={clickHandler}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id && "bg-zinc-700/20"
            )}
        >

            <Icon className="flex-shrink-0 w-5 h-5 text-zinc-400" />

            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-400 group-hover:text-zinc-300 transition",
                params?.channelId === channel.id && "text-zinc-200 group-hover:text-white"
            )}>
                {channel.name}
            </p>

            {
                channel.name !== "general" && role !== MemberRole.GUEST && (
                    <div className="ml-auto flex items-center gap-x-2">
                        <ActionTooltip label="Edit">
                            <Edit 
                                className="hidden group-hover:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition" 
                                onClick={(e) => onAction(e, "editChannel")}
                            />
                        </ActionTooltip>
                        <ActionTooltip label="Delete">
                            <Trash 
                                className="hidden group-hover:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition" 
                                onClick={(e) => onAction(e, "deleteChannel")}
                            />
                        </ActionTooltip>
                    </div>
                )
            }

            {
                channel.name === "general" && (
                    <Lock className="ml-auto w-4 h-4 text-zinc-400" />
                )
            }

        </button>
    );
}


export default ServerChannel;