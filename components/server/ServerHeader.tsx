"use client";

import { Channel, Member, MemberRole, Profile, Server } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModel } from "@/hooks/useModelStore";

interface ServerHeaderProps {
    server : Server & { 
        channels: Channel[];
        members: (Member & { profile: Profile })[];
    };
    role? : MemberRole;
}

export default function ServerHeader ({server, role} : ServerHeaderProps) {

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    const {onOpen} = useModel();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-800 border-b-2 hover:bg-zinc-700/50 transition">
                {server.name}
                <ChevronDown className="h-5 w-5 ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-neutral-400 space-y-[2px]">
                {
                    isModerator && (
                        <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer" onClick={() => onOpen("invite", {server : server})}>
                            Invite
                            <UserPlus className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer" onClick={() => onOpen("editServer", {server : server})}>
                            Settings
                            <Settings className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer" onClick={() => onOpen("members", {server : server})}>
                            Members
                            <Users className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isModerator && (
                        <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer" onClick={() => onOpen("createChannel", {server : server})}>
                            Channel
                            <PlusCircle className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isModerator && (<DropdownMenuSeparator />)
                }
                {
                    isAdmin && (
                        <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer" onClick={() => onOpen("deleteServer", {server : server})}>
                            Delete
                            <Trash className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
                {
                    !isAdmin && (
                        <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer" onClick={() => onOpen("leaveServer", {server : server})}>
                            Leave
                            <LogOut className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}