"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModel } from "@/hooks/useModelStore";

const NavigationAction = () => {

    const {onOpen} = useModel();

    return (
        <div>
            <ActionTooltip side="right" align="center" label="Add server">
                <button className="group flex items-center" onClick={() => onOpen("createServer")}>
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700">
                        <Plus className="group-hover:text-white transition" size={25} />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
}

export default NavigationAction;