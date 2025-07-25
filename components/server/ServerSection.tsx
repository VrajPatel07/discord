"use client";

import { Channel, ChannelType, Member, MemberRole, Profile, Server } from "@prisma/client";

import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModel } from "@/hooks/useModelStore";



interface ServerSectionProps {
    label : string;
    role? : MemberRole;
    sectionType : "channels" | "members";
    channelType? : ChannelType;
    server? : Server & { 
            channels: Channel[];
            members: (Member & { profile: Profile })[];
    }; 
 }


const ServerSection = ({label, role, sectionType, channelType, server} : ServerSectionProps) => {

    const {onOpen} = useModel();

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-400">{label}</p>
            {
                role !== MemberRole.GUEST && sectionType === "channels" && (
                    <ActionTooltip label="Create Channel" side="top">
                        <button className="text-zinc-400 hover:text-zinc-300 transition" onClick={() => onOpen("createChannel", {channelType : channelType})}>
                            <Plus className="h-4 w-4" />
                        </button>
                    </ActionTooltip>
                )
            }
            {
                role === MemberRole.ADMIN && sectionType === "members" && (
                    <ActionTooltip label="Manage Members" side="top">
                        <button className="text-zinc-400 hover:text-zinc-300 transition" onClick={() => onOpen("members", {server : server})}>
                            <Settings className="h-4 w-4" />
                        </button>
                    </ActionTooltip>
                )
            }
        </div>
    );
}


export default ServerSection;