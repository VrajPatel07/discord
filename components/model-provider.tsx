"use client"

import CreateServerModel from "./models/createServerModel";
import EditServerModel from "./models/EditServerModel";
import InviteModel from "./models/InviteModel";


export const ModelProvider = () => {
    return (
        <>
            <CreateServerModel />
            <InviteModel />
            <EditServerModel />
        </>
    );
}