"use client"

import CreateChannelModel from "./models/CreateChannelModel";
import CreateServerModel from "./models/createServerModel";
import DeleteServerModel from "./models/DeleteServerModel";
import EditServerModel from "./models/EditServerModel";
import InviteModel from "./models/InviteModel";
import LeaveServerModel from "./models/LeaveServerModel";
import MembersModel from "./models/MembersModel";


export const ModelProvider = () => {
    return (
        <>
            <CreateServerModel />
            <CreateChannelModel />
            <InviteModel />
            <EditServerModel />
            <MembersModel />
            <LeaveServerModel />
            <DeleteServerModel />
        </>
    );
}