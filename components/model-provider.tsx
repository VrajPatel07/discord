"use client"

import CreateServerModel from "./models/createServerModel";
import EditServerModel from "./models/EditServerModel";
import InviteModel from "./models/InviteModel";
import MembersModel from "./models/MembersModel";


export const ModelProvider = () => {
    return (
        <>
            <CreateServerModel />
            <InviteModel />
            <EditServerModel />
            <MembersModel />
        </>
    );
}