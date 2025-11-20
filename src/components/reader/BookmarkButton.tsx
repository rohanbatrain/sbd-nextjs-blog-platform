"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { BookmarkIcon } from "lucide-react";
import { Button } from "../ui/button";

interface BookmarkButtonProps {
    postId: string;
    websiteId: string;
    apiUrl: string;
}

export function BookmarkButton({ postId, websiteId, apiUrl }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if post is bookmarked (using localStorage for now)
        const bookmarks = JSON.parse(localStorage.getItem("bookmarked_posts") || "[]");
        setIsBookmarked(bookmarks.includes(postId));
    }, [postId]);

    const handleToggleBookmark = async () => {
        setLoading(true);

        try {
            // Track analytics
            await fetch(`${apiUrl}/analytics/track`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    website_id: websiteId,
                    post_id: postId,
                    event_type: "bookmark",
                    metadata: {
                        action: isBookmarked ? "remove" : "add",
                    },
                }),
            });

            // Update local storage
            const bookmarks = JSON.parse(localStorage.getItem("bookmarked_posts") || "[]");

            if (isBookmarked) {
                const updated = bookmarks.filter((id: string) => id !== postId);
                localStorage.setItem("bookmarked_posts", JSON.stringify(updated));
            } else {
                bookmarks.push(postId);
                localStorage.setItem("bookmarked_posts", JSON.stringify(bookmarks));
            }

            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error("Failed to bookmark:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            onClick={handleToggleBookmark}
            disabled={loading}
            className="gap-2"
        >
            <BookmarkIcon className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            {isBookmarked ? "Saved" : "Save for later"}
        </Button>
    );
}
