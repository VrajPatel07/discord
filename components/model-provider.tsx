"use client"

import CreateServerModel from "./models/createServerModel";
import InviteModel from "./models/InviteModel";


export const ModelProvider = () => {
    return (
        <>
            <CreateServerModel />
            <InviteModel />
        </>
    );
}