"use client";

import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";


const formSchema = z.object({
    name : z.string().min(3, {message : "Server name should be of minimum 3 characters"}),
    imageUrl : z.string().nonempty()
})


const InitialModel = () => {

    const form = useForm({
        resolver : zodResolver(formSchema),
        defaultValues : {
            name : "",
            imageUrl : ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const submitHandler = async (values : z.infer<typeof formSchema>) => {
        console.log(values);
    }

    return (
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">

                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Customize your Server</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">Give your server personality with name and image</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">

                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                Image Upload
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
                            <Button className="bg-indigo-500 text-white hover:bg-indigo-500/90 cursor-pointer" disabled={isLoading}>Create</Button>
                        </DialogFooter>
                        
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}

export default InitialModel;