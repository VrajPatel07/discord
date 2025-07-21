"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../user-avatar";


interface ServerMemberProps {
    member : Member & {profile : Profile};
    server : Server;
}

const iconMap = {
    [MemberRole.GUEST] : null,
    [MemberRole.MODERATOR] : <ShieldCheck className="h-4 w-4 ml-auto text-indigo-500" />,
    [MemberRole.ADMIN] : <ShieldAlert className="h-4 w-4 text-rose-500 ml-auto" />
}


const ServerMember = ({member, server} : ServerMemberProps) => {

    const params = useParams();
    const router = useRouter();

    const icon = iconMap[member.role];

    return (
        <button className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 transition mb-1",
            params?.memberId === member.id && "bg-zinc-700/20"
        )}>
            <UserAvatar className="h-8 w-8 md:h-8 md:w-8" src={member.profile.imageUrl} />
            <p className={cn(
                "font-semibold text-sm text-zinc-400 group-hover:text-zinc-300 transition",
                params?.memberId === member.id && "text-zinc-200 group-hover:text-white"
            )}>
                {member.profile.name}
            </p>
            {icon}
        </button>
    );
}


export default ServerMember;