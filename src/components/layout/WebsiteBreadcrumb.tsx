"use client";

import { useCurrentWebsite } from "@/hooks/useCurrentWebsite";
import { Building2 } from "lucide-react";

export function WebsiteBreadcrumb() {
    const website = useCurrentWebsite();

    if (!website) return null;

    return (
        <div className="border-b bg-muted/50" data-testid="website-breadcrumb">
            <div className="container mx-auto px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground">\n                <Building2 className="h-4 w-4" />
                <span className="font-medium text-foreground">{website.name}</span>
                {website.description && (
                    <>
                        <span>•</span>
                        <span className="truncate">{website.description}</span>
                    </>
                )}
            </div>
        </div>
    );
}
