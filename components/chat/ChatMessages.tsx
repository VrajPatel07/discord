"use client";

import { Member, Message, Profile } from "@prisma/client";

import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";


interface ChatMessagesProps {
    name : string;
    member : Member;
    chatId : string;
    apiUrl : string;
    socketUrl : string;
    socketQuery : Record<string, string>;
    paramKey : "channelId" | "conversationId";
    paramValue : string;
    type : "channel" | "conversation"
}

type MessageType = Message & {
    member : Member & {
        profile : Profile
    }
}


const ChatMessages = ({name, member, chatId, apiUrl, socketQuery, socketUrl, paramKey, paramValue, type} : ChatMessagesProps) => {

    const queryKey = `chat:${chatId}`;

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useChatQuery({queryKey, apiUrl, paramKey, paramValue});

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animated-spin my-4" />
                <p className="text-xs text-zinc-400">
                    Loading messages...
                </p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-400">
                    Something went wrong!
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1">

                <ChatWelcome 
                    type={type}
                    name={name}
                />

                <div className="flex flex-col-reverse mt-auto">
                    {
                        data?.pages?.map((group, index) => (
                            <Fragment key={index}>
                                {
                                    group.items.map((message : MessageType) => (
                                        <div key={message.id}>
                                            {message.content}
                                        </div>
                                    ))
                                }
                            </Fragment>
                        ))
                    }
                </div>

            </div>
        </div>
    );
}


export default ChatMessages;