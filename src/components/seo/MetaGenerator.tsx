"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Wand2 } from "lucide-react";

interface MetaGeneratorProps {
    content: string;
    onGenerate: (description: string) => void;
}

export function MetaGenerator({ content, onGenerate }: MetaGeneratorProps) {
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState("");

    const generateMetaDescription = () => {
        setGenerating(true);

        // Simple extraction: get first 160 characters of content
        // In production, you could use AI/NLP to extract key sentences
        const cleanContent = content
            .replace(/<[^>]*>/g, "") // Remove HTML tags
            .replace(/#+\s/g, "") // Remove markdown headers
            .trim();

        const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
        let description = "";

        for (const sentence of sentences) {
            if ((description + sentence).length > 160) break;
            description += sentence.trim() + ". ";
        }

        description = description.trim();
        if (description.length > 160) {
            description = description.substring(0, 157) + "...";
        }

        setGenerated(description);
        setGenerating(false);
    };

    const handleApply = () => {
        onGenerate(generated);
    };

    return (
        <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <Label>Meta Description</Label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={generateMetaDescription}
                    disabled={generating || !content}
                    className="gap-2"
                >
                    <Wand2 className="h-4 w-4" />
                    {generating ? "Generating..." : "Auto-generate"}
                </Button>
            </div>

            {generated && (
                <div className="space-y-2">
                    <Textarea
                        value={generated}
                        onChange={(e) => setGenerated(e.target.value)}
                        rows={3}
                        className="resize-none"
                    />
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            {generated.length} / 160 characters
                        </p>
                        <Button onClick={handleApply} size="sm">
                            Apply
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
