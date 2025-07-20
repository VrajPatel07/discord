"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "../ui/button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";

import { useModel } from "@/hooks/useModelStore";
import { useRouter } from "next/navigation";




const DeleteServerModel = () => {

    const {isOpen, onClose, type, data, onOpen} = useModel();

    const router = useRouter();

    const {server} = data;

    const isModelOpen = isOpen && type === "deleteServer";

    const [loading, setLoading] = useState(false);

    const deleteServer = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/servers/${server?.id}`);
            onClose();
            router.refresh();
            router.push("/");
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-md w-full rounded-lg">

                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Delete Server</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        <span className="text-indigo-500 font-semibold">{server?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button 
                            onClick={onClose}
                            disabled={loading}
                            variant={"ghost"}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={deleteServer}
                            disabled={loading}
                            className="bg-indigo-500 text-white hover:bg-indigo-500/90 cursor-pointer"
                        >
                            Delete
                        </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}

export default DeleteServerModel;