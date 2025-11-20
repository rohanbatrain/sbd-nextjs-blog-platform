"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Save, Clock } from "lucide-react";

interface AutoSaveIndicatorProps {
    postId: string;
    websiteId: string;
    content: string;
    title: string;
    apiUrl: string;
}

export function AutoSaveIndicator({ postId, websiteId, content, title, apiUrl }: AutoSaveIndicatorProps) {
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!postId || !content) return;

        // Auto-save every 30 seconds
        const interval = setInterval(async () => {
            await saveContent();
        }, 30000);

        return () => clearInterval(interval);
    }, [content, title, postId]);

    const saveContent = async () => {
        if (!content || isSaving) return;

        setIsSaving(true);
        try {
            const response = await fetch(
                `${apiUrl}/blog/websites/${websiteId}/posts/${postId}/autosave`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content,
                        title,
                    }),
                }
            );

            if (response.ok) {
                setLastSaved(new Date());
            }
        } catch (error) {
            console.error("Auto-save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const formatLastSaved = () => {
        if (!lastSaved) return "Not saved yet";

        const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);

        if (seconds < 60) return `Saved ${seconds} seconds ago`;
        if (seconds < 3600) return `Saved ${Math.floor(seconds / 60)} minutes ago`;
        return `Saved ${Math.floor(seconds / 3600)} hours ago`;
    };

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSaving ? (
                <Badge variant="secondary" className="gap-1">
                    <Save className="h-3 w-3 animate-pulse" />
                    Saving...
                </Badge>
            ) : (
                <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {formatLastSaved()}
                </Badge>
            )}
        </div>
    );
}
