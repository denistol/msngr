"use client"

import { cn } from "@/lib/utils";

export const Avatar: BaseComponent<{ seed: string, selected?: boolean }> = ({ seed, selected, className }) => {
    const src = `https://api.dicebear.com/8.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
    return (
        <div className={cn("w-6 h-6 overflow-hidden rounded-full flex items-center justify-center box-content p-1 border-2",
            { 'border-foreground': selected },
            className,
        )}>
            <img
                className="w-full h-full"
                src={src}
                alt="User Avatar"
            />
        </div>
    );
}
