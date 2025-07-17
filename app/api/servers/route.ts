import {v4 as uuidV4} from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req : Request) {
    try {

        const {name, imageUrl} = await req.json();

        const profile = await currentProfile();

        if(!profile) {
            return new NextResponse("Unauthorized", {status : 401})
        }

        const server = await db.server.create({
            data : {
                name : name,
                imageUrl : imageUrl,
                inviteCode : uuidV4(),
                profileId : profile.id,
                channels : {
                    create : [
                        {name : "general", profileId : profile.id}
                    ]
                },
                members : {
                    create : [
                        {profileId : profile.id, role : MemberRole.ADMIN}
                    ]
                }
            }
        });

        return NextResponse.json({message : "Server created successfully", data : server}, {status : 200});
    }
    catch(error) {
        return new NextResponse("Error while creating server", {status : 500})
    }
}