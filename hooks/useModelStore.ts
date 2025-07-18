import { Server } from "@prisma/client";
import {create} from "zustand";

export type ModeType = "createServer" | "invite" | "editServer";

interface ModelData {
    server? : Server;
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