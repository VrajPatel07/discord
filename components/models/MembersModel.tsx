"use client";

import { useState } from "react";
import qs from "query-string";
import axios from "axios";


import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuSubTrigger} from "@/components/ui/dropdown-menu";

import { Channel, Member, MemberRole, Profile, Server } from "@prisma/client";

import { useModel } from "@/hooks/useModelStore";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import { useRouter } from "next/navigation";




const MembersModel = () => {

    const {isOpen, onClose, type, data, onOpen} = useModel();

    const [loadingId, setLoadingId] = useState("");

    const router = useRouter();

    const {server} = data as {server: Server & { 
        channels: Channel[];
        members: (Member & { profile: Profile })[];
    }};

    const isModelOpen = isOpen && type === "members";

    const roleIconMap = {
        "ADMIN" : <ShieldAlert className="h-4 w-4 text-rose-500" />,
        "GUEST" : null,
        "MODERATOR" : <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
    };

    const onKick = async (memberId : string) => {
        try {
            setLoadingId(memberId);

            const url = qs.stringifyUrl({
                url : `/api/members/${memberId}`,
                query : {
                    serverId : server.id
                }
            });

            const response = await axios.delete(url);

            router.refresh();

            onOpen("members", {server : response.data});
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoadingId("");
        }
    }

    const onRoleChange = async (memberId : string, role : MemberRole) => {
        try {
            setLoadingId(memberId);

            const url = qs.stringifyUrl({
                url : `/api/members/${memberId}`,
                query : {
                    serverId : server?.id
                }
            });

            const response = await axios.put(url, {role : role});

            console.log(response.data)

            onOpen("members", {server : response.data});

            router.refresh();
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden max-w-md w-full rounded-lg">

                <DialogHeader className="pt-8 px-6">

                    <DialogTitle className="text-2xl text-center font-bold">Members</DialogTitle>

                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length} Members
                    </DialogDescription>

                </DialogHeader>

                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {
                        server?.members?.map((member) => (
                            <div key={member.id} className="flex items-center gap-x-2 mb-6">

                                <UserAvatar src={member.profile.imageUrl} />

                                <div className="flex flex-col gap-y-1">
                                    <div className="text-xs font-semibold flex items-center gap-x-1">
                                        {member.profile.name}
                                        {roleIconMap[member.role]}
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        {member.profile.email}
                                    </p>
                                </div>

                                {
                                    server.profileId !== member.profileId && loadingId !== member.id && 
                                    (
                                        <div className="ml-auto">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="outline-none focus:outline-none border-none">

                                                    <MoreVertical className="h-4 w-4 text-zinc-500" />

                                                    <DropdownMenuContent side="left">
                                                        <DropdownMenuSub>

                                                            <DropdownMenuSubTrigger className="flex items-center">
                                                                <ShieldQuestion className="w-4 h-4 mr-2" />
                                                                <span>Role</span>
                                                            </DropdownMenuSubTrigger>

                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>

                                                                    <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                                                        <Shield className="h-4 w-4 mr-2" />
                                                                        Guest
                                                                        {
                                                                            member.role === "GUEST" && (
                                                                                <Check className="h-4 w-4 ml-auto" />
                                                                            )
                                                                        }
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                                                        <ShieldCheck className="h-4 w-4 mr-2" />
                                                                        Moderator
                                                                        {
                                                                            member.role === "MODERATOR" && (
                                                                                <Check className="h-4 w-4 ml-auto" />
                                                                            )
                                                                        }
                                                                    </DropdownMenuItem>

                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>

                                                        </DropdownMenuSub>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                            <Gavel className="h-4 w-4 mr-2" />
                                                            Kick
                                                        </DropdownMenuItem>

                                                    </DropdownMenuContent>

                                                </DropdownMenuTrigger>
                                            </DropdownMenu>
                                        </div>
                                    )
                                }

                                {
                                    loadingId === member.id && (
                                        <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                                    )
                                }

                            </div>
                        ))
                    }
                </ScrollArea>

            </DialogContent>
        </Dialog>
    );
}

export default MembersModel;