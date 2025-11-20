"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";
import { Badge } from "../ui/badge";

interface PopularPost {
    post_id: string;
    title: string;
    slug: string;
    view_count: number;
    featured_image?: string;
}

interface PopularPostsProps {
    websiteId: string;
    apiUrl: string;
    limit?: number;
}

export function PopularPosts({ websiteId, apiUrl, limit = 5 }: PopularPostsProps) {
    const [posts, setPosts] = useState<PopularPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPopularPosts();
    }, [websiteId]);

    const loadPopularPosts = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/blog/websites/${websiteId}/posts?sort_by=view_count&limit=${limit}&status=published`
            );

            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to load popular posts:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="h-16 w-16 bg-muted rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-full"></div>
                                <div className="h-3 bg-muted rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (posts.length === 0) return null;

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Popular Posts</h3>
            </div>

            <div className="space-y-4">
                {posts.map((post, index) => (
                    <Link
                        key={post.post_id}
                        href={`/blog/${post.post_id}/${post.slug}`}
                        className="flex gap-3 group hover:bg-accent p-2 rounded-lg transition-colors"
                    >
                        <div className="flex items-center justify-center min-w-[32px]">
                            <Badge variant={index < 3 ? "default" : "outline"} className="h-6 w-6 p-0 justify-center">
                                {index + 1}
                            </Badge>
                        </div>

                        {post.featured_image && (
                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                <img
                                    src={post.featured_image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                            </div>
                        )}

                        <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                {post.view_count.toLocaleString()} views
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </Card>
    );
}
