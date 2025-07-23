import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";



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

            <div className="flex-1">Messages</div>

            <ChatInput 
                name={channel.name}
                type={"channel"}
                apiUrl="/api/socket/messages"
                query={{
                    channelId : channel.id,
                    serverId : channel.serverId
                }}
            />

        </div>
    );
}

export default ChannelIDPage;