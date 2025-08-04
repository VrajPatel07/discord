"use client";

import { useEffect, useState } from "react";
import {LiveKitRoom, VideoConference} from "@livekit/components-react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";


interface MediaRoomProps {
    chatId : string;
    video : boolean;
    audio : boolean;
}


export const MediaRoom = ({chatId, video, audio} : MediaRoomProps) => {

    const {user} = useUser();

    const [token, setToken] = useState("");

    useEffect(() => {

        const getToken = async () => {
            try {
                const response = await fetch(`/api/token?room=${chatId}&username=${user?.username}`);
                const data = await response.json();
                const _token = data.token;
                setToken(_token); 
            }
            catch (error) {
                console.log(error);
            }
        }

        getToken();

    }, [user?.username, chatId]);

    if (token === "" || !user) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            </div>
        )
    }

    return (
        <LiveKitRoom
            token={token}
            connect={true}
            video={video}
            audio={audio}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        >

            <VideoConference />

        </LiveKitRoom>
    );

}