import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";


export async function  GET(req : Request) {
    try {

        const profile = await currentProfile();

        const {searchParams} = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");

        if (!profile) {
            return new NextResponse("Unauthorized", {status : 401});
        }

        if (!channelId) {
            return new NextResponse("Channed ID is missing", {status : 401});
        }

        let messages : Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take : 10,
                skip : 1,
                cursor : {
                    id : cursor
                },
                where : {
                    channelId : channelId
                },
                include : {
                    member : {
                        include : {
                            profile : true
                        }
                    }
                },
                orderBy : {
                    createdAt : "desc"
                }
            })
        }
        else {
            messages = await db.message.findMany({
                take : 10,
                where : {
                    channelId : channelId
                },
                include : {
                    member : {
                        include : {
                            profile : true
                        }
                    }
                },
                orderBy : {
                    createdAt : "desc"
                }
            })
        }

        let nextCursor = null;

        if (messages.length === 10) {
            nextCursor = messages[9].id
        }

        return NextResponse.json({
            items : messages,
            nextCursor : nextCursor
        });

    }
    catch (error) {
        return new NextResponse(`Error while fetching messages : ${error}`, {status : 500});
    }
}