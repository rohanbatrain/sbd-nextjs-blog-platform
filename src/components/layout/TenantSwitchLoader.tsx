"use client";

import { useWebsite } from "@/context/WebsiteContext";
import { Loader2 } from "lucide-react";

export function TenantSwitchLoader() {
    const { isLoading } = useWebsite();

    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary/10 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Switching website...</span>
            </div>
        </div>
    );
}
