import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PATCH(req : Request, {params} : {params : {serverId : string}}) {
    try {

        const profile = await currentProfile();

        const {serverId} = await params;
        const {name, imageUrl} = await req.json();

        if(!profile) {
            return new NextResponse("Unauthorized", {status : 401});
        }

        const server = await db.server.update({
            where : {
                id : serverId,
                profileId : profile.id
            },
            data : {
                name : name,
                imageUrl : imageUrl
            }
        });

        return NextResponse.json({message : "Server updated successfully", data : server}, {status : 200});
    } 
    catch (error) {
        return new NextResponse("Error while updating server", {status : 500});
    }
}


export async function DELETE(req : Request, {params} : {params : {serverId : string}}) {
    try {

        const profile = await currentProfile();

        const {serverId} = await params;

        if(!profile) {
            return new NextResponse("Unauthorized", {status : 401});
        }

        const server = await db.server.delete({
            where : {
                id : serverId,
                profileId : profile.id
            }
        });

        return NextResponse.json(server);
    } 
    catch (error) {
        return new NextResponse("Error while deleting server", {status : 500});
    }
}