import {create} from "zustand";
import { Channel, ChannelType, Server } from "@prisma/client";

export type ModelType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | 
                        "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel" | "messageFile" | 
                        "deleteMessage";

interface ModelData {
    server? : Server;
    channelType? : ChannelType;
    channel? : Channel;
    apiUrl? : string;
    query? : Record<string, any>
}

interface ModelStore {
    type : ModelType | null;
    isOpen : boolean;
    onOpen : (type : ModelType, data? : ModelData) => void;
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