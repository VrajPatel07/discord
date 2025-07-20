"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useParams, useRouter } from "next/navigation";


interface ServerSearchProps {
    data : {
        label : string;
        type : "channel" | "member",
        data : {
            icon : React.ReactNode;
            name : string;
            id : string;
        }[] | undefined
    }[]
}


const ServerSearch = ({data} : ServerSearchProps) => {

    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();

    const searchHandler = ({id, type} : {id : string, type : "channel" | "member"}) => {

        setOpen(false);

        if(type === "member") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }

        if(type === "channel") {
            return router.push(`/servers/${params?.serverId}/channels/${id}`);
        }

    }

    return (
        <>
            <button 
                className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition" 
                onClick={() => setOpen(true)}
            >
                <Search className="w-4 h-4 text-zinc-400" />
                <p className="font-semibold text-sm text-zinc-400 group-hover:text-zinc-300 transition">Search</p>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search channels and members" />
                <CommandList>
                    <CommandEmpty>No Results</CommandEmpty>
                    {
                        data.map(({label, type, data}) => {

                            if (!data?.length) {
                                return null;
                            }

                            return (
                                <CommandGroup key={label} heading={label}>
                                    {
                                        data?.map(({id, icon, name}) => (
                                            <CommandItem key={id} onSelect={() => searchHandler({id, type})}>
                                                {icon}
                                                <span>{name}</span>
                                            </CommandItem>
                                        ))
                                    }
                                </CommandGroup>
                            )
                        })
                    }
                </CommandList>
            </CommandDialog>
        </>
    );
}

export default ServerSearch;