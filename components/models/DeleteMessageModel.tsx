"use client";

import { useState } from "react";
import axios from "axios";
import qs from "query-string";

import { Button } from "../ui/button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";

import { useModel } from "@/hooks/useModelStore";




const DeleteMessageModel = () => {

    const {isOpen, onClose, type, data, onOpen} = useModel();

    const isModelOpen = isOpen && type === "deleteMessage";

    const [loading, setLoading] = useState(false);

    const {apiUrl, query} = data;

    const deleteMessage = async () => {
        try {
            setLoading(true);

            const url = qs.stringifyUrl({
                url : apiUrl || "", 
                query : query
            })

            await axios.delete(url);

            onClose();
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
                    <DialogTitle className="text-2xl text-center font-bold">Delete Message</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        Thsi message will be permanently deleted.
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
                            onClick={deleteMessage}
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

export default DeleteMessageModel;