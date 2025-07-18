"use client";

import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import FileUpload from "@/components/file-upload";
import { useModel } from "@/hooks/useModelStore";
import { useEffect } from "react";


const formSchema = z.object({
    name : z.string().min(3, {message : "Server name should be of minimum 3 characters"}),
    imageUrl : z.string().nonempty()
})


const EditServerModel = () => {

    const router = useRouter();

    const {isOpen, onClose, type, data} = useModel();

    const isModelOpen = isOpen && type === "editServer";

    const {server} = data;

    const form = useForm({
        resolver : zodResolver(formSchema),
        defaultValues : {
            name : "",
            imageUrl : ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if(server) {
            form.setValue("name", server.name);
            form.setValue("imageUrl", server.imageUrl);
        }
    }, [server, form]);

    const submitHandler = async (values : z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/servers/${server?.id}`, values);
            form.reset();
            router.refresh();
            onClose();
        }
        catch(error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }    

    return (
        <Dialog open={isModelOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-md w-full rounded-lg">

                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Customize your Server</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">Give your server personality with name and image</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">

                        <div className="space-y-8 px-6">

                            <div className="flex items-center justify-center text-center p-4">
                                <FormField 
                                    control={form.control}
                                    name="imageUrl"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-b-1 focus-visible:ring-1    text-black focus-visible:ring-offset-0 "
                                                placeholder="Enter server name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                        </div>

                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button className="bg-indigo-500 text-white hover:bg-indigo-500/90 cursor-pointer" disabled={isLoading}>Save</Button>
                        </DialogFooter>
                        
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}

export default EditServerModel;