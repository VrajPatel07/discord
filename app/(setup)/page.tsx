import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import InitialModel from "@/components/models/InitialModel";


const SetupPage = async () => {

    const profile = await initialProfile();

    const server = await db.server.findFirst({
        where : {
            profileId : profile.id
        }
    });

    if (server) {
        redirect(`/servers/${server.id}`);
    }

    return (
        <InitialModel />
    );
}

export default SetupPage;