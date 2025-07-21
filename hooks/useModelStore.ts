import {create} from "zustand";
import { Channel, ChannelType, Server } from "@prisma/client";

export type ModeType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | 
                        "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel";

interface ModelData {
    server? : Server;
    channelType? : ChannelType;
    channel? : Channel;
}

interface ModelStore {
    type : ModeType | null;
    isOpen : boolean;
    onOpen : (type : ModeType, data? : ModelData) => void;
    onClose : () => void;
    data : ModelData;
}

export const useModel = create<ModelStore>((set) => ({
    type : null,
    isOpen : false,
    onOpen : (type, data = {}) => set({isOpen : true, type : type, data : data}),
    onClose : () => set({type : null, isOpen : false}),
    data : {}
}))