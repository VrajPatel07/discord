"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { Plus, Smile } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

import { useModel } from "@/hooks/useModelStore";


interface ChatInputProps {
    apiUrl : string;
    query : Record<string, any>;
    name : string;
    type : "conversation" | "channel";
}


const formSchema = z.object({
    content : z.string().min(1)
})


const ChatInput = ({apiUrl, query, name, type} : ChatInputProps) => {

    const {onOpen} = useModel();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            content : ""
        }
    });

    const loading = form.formState.isSubmitting;

    const submitHandler = async (values : z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url : apiUrl,
                query : query
            })

            await axios.post(url, values);

            form.setValue("content", "");
        }
        catch (error) {
            console.log(`Error while sending message : ${error}`);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)}>
                <FormField 
                    control={form.control}
                    name="content"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">

                                    <button
                                        type="button"
                                        onClick={() => onOpen("messageFile", { apiUrl : apiUrl, query : query })}
                                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-400 hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                                    >
                                        <Plus className="text-[#313338]" />
                                    </button>

                                    <Input 
                                        disabled={loading}
                                        className="px-14 py-6 bg-zinc-700/70 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200"
                                        placeholder={`Message ${type === "conversation" ? name : `#${name}`}`}
                                        {...field}
                                    />

                                    <div className="absolute top-7 right-8">
                                        <Smile />
                                    </div>

                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}


export default ChatInput;