import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

import { db } from "@/lib/db";


export const currentProfilePages = async (req : NextApiRequest) => {

    const {userId} = await getAuth(req);

    if(!userId) {
        return null;
    }

    const profile = await db.profile.findUnique({
        where : {
            userId : userId
        }
    });

    return profile;
    
}