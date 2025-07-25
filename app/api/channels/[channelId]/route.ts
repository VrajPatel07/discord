import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";


export async function PATCH(req : Request, {params} : {params : {channelId : string}}) {
    try {
        const profile = await currentProfile();

        const {searchParams} = new URL(req.url);

        const serverId = searchParams.get("serverId");

        const {channelId} = await params; 

        if(!profile) {
            return new NextResponse("Unauthorized", {status : 400});
        }

        if(!serverId) {
            return new NextResponse("Server ID is missing", {status : 400});
        }

        if(!channelId) {
            return new NextResponse("Channel ID is missing", {status : 400});
        }

        const server = await db.server.update({
            where : {
                id : serverId,
                members : {
                    some : {
                        profileId : profile.id,
                        role : {
                            in : [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data : {
                channels : {
                    delete : {
                        id : channelId,
                        name : {
                            not : "general"
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);
    }
    catch(error) {
        return new NextResponse("Error while deleting channel", {status : 500})
    }
}



export async function PUT(req : Request, {params} : {params : {channelId : string}}) {
    try {
        const profile = await currentProfile();

        const {searchParams} = new URL(req.url);

        const serverId = searchParams.get("serverId");

        const {channelId} = await params; 

        const {name, type} = await req.json();

        if(!profile) {
            return new NextResponse("Unauthorized", {status : 400});
        }

        if(!serverId) {
            return new NextResponse("Server ID is missing", {status : 400});
        }

        if(!channelId) {
            return new NextResponse("Channel ID is missing", {status : 400});
        }
        
        if(name === "general") {
            return new NextResponse("Name cannot be 'general'", {status : 400});
        }

        const server = await db.server.update({
            where : {
                id : serverId,
                members : {
                    some : {
                        profileId : profile.id,
                        role : {
                            in : [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data : {
                channels : {
                    update : {
                        where : {
                            id : channelId,
                            NOT : {
                                name : "general"
                            }
                        },
                        data : {
                            name : name,
                            type : type
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);
    }
    catch(error) {
        return new NextResponse("Error while updating channel", {status : 500})
    }
}