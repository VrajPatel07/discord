import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PUT(req : Request, {params} : {params : {memberId : string}}) {
    try {
        const profile = await currentProfile();

        if(!profile) {
            return new NextResponse("Unauthorized", {status : 401});
        }

        const {searchParams} = new URL(req.url);
        const {role} = await req.json();
        const {memberId} = await params;

        console.log(memberId);

        const serverId = searchParams.get("serverId");

        if(!serverId) {
            return new NextResponse("Server ID is missing", {status : 400});
        }

        if(!memberId) {
            return new NextResponse("Member ID is missing", {status : 400});
        }

        const server = await db.server.update({
            where : {
                id : serverId,
                profileId : profile.id
            },
            data : {
                members : {
                    update : {
                        where : {
                            id : memberId,
                            profileId : {
                                not : profile.id    // User can't change his role just by using API
                            }
                        },
                        data : {
                            role : role
                        }
                    }
                }
            },
            include : {
                members : {
                    include : {
                        profile : true
                    },
                    orderBy : {
                        role : "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);
    }
    catch (error) {
        return new NextResponse("Error while updating role", {status : 500})
    }
}



export async function DELETE(req : Request, {params} : {params : {memberId : string}}) {
    try {
        const profile = await currentProfile();

        if(!profile) {
            return new NextResponse("Unauthorized", {status : 401});
        }

        const {searchParams} = new URL(req.url);
        const {memberId} = await params;

        const serverId = searchParams.get("serverId");

        if(!serverId) {
            return new NextResponse("Server ID is missing", {status : 400});
        }

        if(!memberId) {
            return new NextResponse("Member ID is missing", {status : 400});
        }

        const server = await db.server.update({
            where : {
                id : serverId,
                profileId : profile.id
            },
            data : {
                members : {
                    delete : {
                        id : memberId,
                        profileId : {
                            not : profile.id        // User can't kick out himself just by using API
                        }
                    }
                }
            },
            include : {
                members : {
                    include : {
                        profile : true
                    },
                    orderBy : {
                        role : "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);
    }
    catch (error) {
        return new NextResponse("Error while kicking out user", {status : 500})
    }
}