"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { History, RotateCcw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BlogVersion {
    version_id: string;
    post_id: string;
    title: string;
    content: string;
    excerpt?: string;
    created_at: string;
    created_by: string;
    change_summary?: string;
}

interface VersionHistoryProps {
    postId: string;
    websiteId: string;
    apiUrl: string;
    onRestore: (version: BlogVersion) => void;
}

export function VersionHistory({ postId, websiteId, apiUrl, onRestore }: VersionHistoryProps) {
    const [open, setOpen] = useState(false);
    const [versions, setVersions] = useState<BlogVersion[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState<BlogVersion | null>(null);

    useEffect(() => {
        if (open) {
            loadVersions();
        }
    }, [open]);

    const loadVersions = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiUrl}/blog/websites/${websiteId}/posts/${postId}/versions`
            );

            if (response.ok) {
                const data = await response.json();
                setVersions(data);
            }
        } catch (error) {
            console.error("Failed to load versions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (version: BlogVersion) => {
        try {
            const response = await fetch(
                `${apiUrl}/blog/websites/${websiteId}/posts/${postId}/restore`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        version_id: version.version_id,
                    }),
                }
            );

            if (response.ok) {
                onRestore(version);
                setOpen(false);
            }
        } catch (error) {
            console.error("Failed to restore version:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <History className="h-4 w-4" />
                    Version History
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Version History</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">Loading versions...</p>
                    </div>
                ) : versions.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">No version history available</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {versions.map((version, index) => (
                            <Card
                                key={version.version_id}
                                className={`p-4 cursor-pointer hover:bg-accent transition-colors ${selectedVersion?.version_id === version.version_id ? "border-primary" : ""
                                    }`}
                                onClick={() => setSelectedVersion(version)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            {index === 0 && (
                                                <Badge variant="default">Current</Badge>
                                            )}
                                            <span className="text-sm font-medium">{version.title}</span>
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                                            {" by "}{version.created_by}
                                        </p>

                                        {version.change_summary && (
                                            <p className="text-sm text-muted-foreground italic">
                                                {version.change_summary}
                                            </p>
                                        )}

                                        {selectedVersion?.version_id === version.version_id && (
                                            <div className="mt-4 p-3 bg-muted rounded-md">
                                                <p className="text-sm line-clamp-3">{version.content.substring(0, 300)}...</p>
                                            </div>
                                        )}
                                    </div>

                                    {index !== 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRestore(version);
                                            }}
                                            className="gap-2"
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                            Restore
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
