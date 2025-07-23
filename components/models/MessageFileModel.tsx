"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";

import { useModel } from "@/hooks/useModelStore";


const formSchema = z.object({
    fileUrl : z.string().nonempty()
})


const MessageFileModel = () => {

    const router = useRouter();

    const {isOpen, onClose, type, data} = useModel();

    const isModelOpen = isOpen && type === "messageFile";

    const {apiUrl, query} = data;

    const form = useForm({
        resolver : zodResolver(formSchema),
        defaultValues : {
            fileUrl : ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const submitHandler = async (values : z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url : apiUrl || "",
                query : query
            })

            await axios.post(url, {
                ...values,
                content : values.fileUrl
            });

            router.refresh();
            handleClose();
        }
        catch(error) {
            console.log(error)
        }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-md w-full rounded-lg">

                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Add Attachment</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">Send file as a message</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">

                        <div className="space-y-8 px-6">

                            <div className="flex items-center justify-center text-center p-4">
                                <FormField 
                                    control={form.control}
                                    name="fileUrl"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                        </div>

                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button className="bg-indigo-500 text-white hover:bg-indigo-500/90 cursor-pointer" disabled={isLoading}>Send</Button>
                        </DialogFooter>
                        
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}

export default MessageFileModel;