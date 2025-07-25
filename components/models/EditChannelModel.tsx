"use client";

import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ChannelType } from "@prisma/client";

import { useModel } from "@/hooks/useModelStore";
import { useEffect } from "react";



const formSchema = z.object({
    name : z.string()
        .min(3, {message : "Channel name should be of minimum 3 characters"})
        .max(30, {message : "Channel name should be of maximum 30 characters"})
        .refine(name => name !== "general", {message : "Channel name can't be 'general'"}),
    type : z.nativeEnum(ChannelType)
})



const EditChannelModel = () => {

    const router = useRouter();

    const {isOpen, onClose, type, data} = useModel();

    const isModelOpen = isOpen && type === "editChannel";

    const {channel, server} = data;


    const form = useForm({
        resolver : zodResolver(formSchema),
        defaultValues : {
            name : "",
            type : channel?.type || ChannelType.TEXT
        }
    });


    useEffect(() => {
        if(channel) {
            form.setValue("name", channel.name);
            form.setValue("type", channel.type);
        }
    }, [channel, form]);


    const isLoading = form.formState.isSubmitting;


    const submitHandler = async (values : z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url : `/api/channels/${channel?.id}`,
                query : {
                    serverId : server?.id
                }
            })

            await axios.put(url, values);

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
                    <DialogTitle className="text-2xl text-center font-bold">Edit Channel</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">

                        <div className="space-y-8 px-6">

                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-secondary/70">Channel name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-b-1 focus-visible:ring-1 text-black focus-visible:ring-offset-0 "
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="type"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-secondary/70">Channel Type</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                    <SelectValue placeholder="Select channel type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Object.values(ChannelType).map((type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                            className="capitalize"
                                                        >
                                                            {type.toLowerCase()}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
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

export default EditChannelModel;