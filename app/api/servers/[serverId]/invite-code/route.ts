import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuidV4} from "uuid";


export async function PATCH(req : Request, {params} : {params : {serverId : string}}) {
    try {

        const profile = await currentProfile();

        if(!profile) {
            return new NextResponse("Unauthorized", {status : 401});
        }

        if(!params.serverId) {
            return new NextResponse("Server ID is missing", {status : 400});
        }

        const server = await db.server.update({
            where : {
                id : params.serverId,
                profileId : profile.id
            },
            data : {
                inviteCode : uuidV4()
            }
        });

        return NextResponse.json({message : "Invite link refreshed", data : server}, {status : 200});

    }
    catch(error) {
        return new NextResponse("Error while refreshing invite link", {status : 500});
    }
}