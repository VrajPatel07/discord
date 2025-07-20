"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "../ui/button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";

import { useModel } from "@/hooks/useModelStore";
import { useRouter } from "next/navigation";




const LeaveServerModel = () => {

    const {isOpen, onClose, type, data, onOpen} = useModel();

    const router = useRouter();

    const {server} = data;

    const isModelOpen = isOpen && type === "leaveServer";

    const [loading, setLoading] = useState(false);

    const leaveServer = async () => {
        try {
            setLoading(true);
            await axios.patch(`/api/servers/${server?.id}/leave`);
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
                    <DialogTitle className="text-2xl text-center font-bold">Leave Server</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}?</span></DialogDescription>
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
                            onClick={leaveServer}
                            disabled={loading}
                            className="bg-indigo-500 text-white hover:bg-indigo-500/90 cursor-pointer"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}

export default LeaveServerModel;