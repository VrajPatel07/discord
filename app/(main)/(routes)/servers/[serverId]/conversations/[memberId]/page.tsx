import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";

import ChatHeader from "@/components/chat/ChatHeader";



interface MemberIDPageProps {
    params : {
        memberId : string;
        serverId : string;
    }
}


const MemberIDPage = async ({params} : MemberIDPageProps) => {

    const {memberId, serverId} = await params;

    const profile = await currentProfile();

    if (!profile) {
        return <RedirectToSignIn />
    }

    const currentMember = await db.member.findFirst({
        where : {
            serverId : serverId,
            profileId : profile.id
        },
        include : {
            profile : true
        }
    });

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, memberId);

    if (!conversation) {
        return redirect(`/servers/${serverId}`);
    }

    const {memberOne, memberTwo} = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-[#313338] flex flex-col h-full">

            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={serverId}
                type="conversation"
            />

        </div>
    );
}

export default MemberIDPage;