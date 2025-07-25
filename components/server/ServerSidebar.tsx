import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";

import ServerHeader from "./ServerHeader";
import ServerSearch from "./ServerSearch";
import ServerSection from "./ServerSection";
import ServerChannel from "./ServerChannel";
import ServerMember from "./ServerMember";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {

    const profile = await currentProfile();

    const server = await db.server.findFirst({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    });


    if (!server) {
        return redirect("/");
    }


    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);


    const members = server?.members


    const role = server?.members.find((member) => member.profileId === profile?.id)?.role;

    
    return (
        <div className="flex flex-col h-full text-primary w-full bg-[#2B2D31]">

            <ServerHeader server={server} role={role} />

            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: server?.members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            }
                        ]}
                    />
                </div>

                <Separator className="bg-zinc-700 rounded-md my-2" />

                {
                    !!textChannels?.length && (
                        <div className="mb-2">
                            <ServerSection
                                sectionType="channels"
                                channelType={ChannelType.TEXT}
                                role={role}
                                label="Text Channels"
                            />
                            <div className="space-y-[2px]">
                                {
                                    textChannels.map((channel) => (
                                        <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

                {
                    !!audioChannels?.length && (
                        <div className="mb-2">
                            <ServerSection
                                sectionType="channels"
                                channelType={ChannelType.AUDIO}
                                role={role}
                                label="Voice Channels"
                            />
                            <div className="space-y-[2px]">
                                {
                                    audioChannels.map((channel) => (
                                        <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

                {
                    !!videoChannels?.length && (
                        <div className="mb-2">
                            <ServerSection
                                sectionType="channels"
                                channelType={ChannelType.VIDEO}
                                role={role}
                                label="Video Channels"
                            />
                            <div className="space-y-[2px]">
                                {
                                    videoChannels.map((channel) => (
                                        <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

                {
                    !!members?.length && (
                        <div className="mb-2">
                            <ServerSection
                                sectionType="members"
                                role={role}
                                label="Members"
                                server={server}
                            />
                            <div className="space-y-[2px]">
                                {
                                    members.map((member) => (
                                        <ServerMember 
                                            key={member.id} 
                                            currentUserId={profile?.id} 
                                            member={member} 
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

            </ScrollArea>

        </div>
    );
}

export default ServerSidebar;