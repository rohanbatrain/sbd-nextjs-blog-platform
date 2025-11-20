"use client";

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Facebook, Twitter, Linkedin } from "lucide-react";

interface SocialPreviewProps {
    title: string;
    description?: string;
    image?: string;
    url: string;
}

export function SocialPreview({ title, description, image, url }: SocialPreviewProps) {
    const truncatedTitle = title.length > 60 ? title.substring(0, 60) + "..." : title;
    const truncatedDesc = description && description.length > 160
        ? description.substring(0, 160) + "..."
        : description;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Facebook className="h-4 w-4" /> Facebook Preview
                </h3>
                <Card className="overflow-hidden">
                    {image && (
                        <div className="aspect-video w-full bg-muted">
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">{new URL(url).hostname}</p>
                        <h4 className="font-semibold text-lg">{truncatedTitle}</h4>
                        {truncatedDesc && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{truncatedDesc}</p>
                        )}
                    </div>
                </Card>
            </div>

            <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Twitter className="h-4 w-4" /> Twitter/X Preview
                </h3>
                <Card className="overflow-hidden">
                    {image && (
                        <div className="aspect-video w-full bg-muted">
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="p-3 space-y-1">
                        <h4 className="font-semibold">{truncatedTitle}</h4>
                        {truncatedDesc && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{truncatedDesc}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{new URL(url).hostname}</p>
                    </div>
                </Card>
            </div>

            <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Linkedin className="h-4 w-4" /> LinkedIn Preview
                </h3>
                <Card className="overflow-hidden">
                    {image && (
                        <div className="aspect-video w-full bg-muted">
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="p-3 space-y-1">
                        <h4 className="font-semibold">{truncatedTitle}</h4>
                        {truncatedDesc && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{truncatedDesc}</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
