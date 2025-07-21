import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ChatHeader from "@/components/chat/ChatHeader";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";



interface ChannelIDPageProps {
    params : {
        serverId : string;
        channelId : string;
    }
}


const ChannelIDPage = async ({params} : ChannelIDPageProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return <RedirectToSignIn />;
    }

    const {serverId, channelId} = await params;

    const channel = await db.channel.findUnique({
        where : {
            id : channelId
        }
    });

    const member = await db.member.findFirst({
        where : {
            serverId : serverId,
            profileId : profile.id
        }
    });

    if (!channel || !member) {
        return redirect("/");
    }

    return (
        <div className="bg-[#313338] flex flex-col h-full">
            <ChatHeader
                serverId={channel.serverId}
                type="channel"
                name={channel.name}
            />
        </div>
    );
}

export default ChannelIDPage;