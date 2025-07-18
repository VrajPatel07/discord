import {create} from "zustand";

export type ModeType = "createServer";

interface ModelStore {
    type : ModeType | null;
    isOpen : boolean;
    onOpen : (type : ModeType) => void;
    onClose : () => void;
}


export const useModel = create<ModelStore>((set) => ({
    type : null,
    isOpen : false,
    onOpen : (type) => set({isOpen : true, type : type}),
    onClose : () => set({type : null, isOpen : false})
}))