"use client";
import React from "react";
import { motion } from "framer-motion";

export function HoverBorderGradient({
    children,
    containerClassName,
    className,
    as: Tag = "button",
    ...props
}: React.PropsWithChildren<
    {
        as?: React.ElementType;
        containerClassName?: string;
        className?: string;
        duration?: number;
        clockwise?: boolean;
    } & React.HTMLAttributes<HTMLElement>
>) {
    return (
        <Tag
            className={`relative flex content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit rounded-full ${containerClassName}`}
            {...props}
        >
            <div
                className={`w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit] ${className}`}
            >
                {children}
            </div>
            <motion.div
                className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
                style={{
                    filter: "blur(2px)",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
                initial={{ background: "transparent" }}
                animate={{
                    background: [
                        "radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)",
                        "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)",
                    ],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />
            <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
        </Tag>
    );
}
