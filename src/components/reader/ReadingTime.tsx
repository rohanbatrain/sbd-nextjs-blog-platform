"use client";

import { Clock } from "lucide-react";
import { Badge } from "../ui/badge";

interface ReadingTimeProps {
    content: string;
    wordsPerMinute?: number;
}

export function ReadingTime({ content, wordsPerMinute = 200 }: ReadingTimeProps) {
    // Calculate word count
    const wordCount = content.trim().split(/\s+/).length;

    // Calculate reading time
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    return (
        <Badge variant="secondary" className="gap-1.5">
            <Clock className="h-3 w-3" />
            {minutes} min read
        </Badge>
    );
}
