"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedPost {
    post_id: string;
    title: string;
    slug: string;
    excerpt?: string;
    featured_image?: string;
    category?: string;
}

interface RelatedPostsProps {
    postId: string;
    websiteId: string;
    category?: string;
    tags?: string[];
    apiUrl: string;
}

export function RelatedPosts({ postId, websiteId, category, tags = [], apiUrl }: RelatedPostsProps) {
    const [posts, setPosts] = useState<RelatedPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRelatedPosts();
    }, [postId]);

    const loadRelatedPosts = async () => {
        try {
            // Fetch posts from the same category
            const response = await fetch(
                `${apiUrl}/blog/websites/${websiteId}/posts?category=${category || ""}&limit=4`
            );

            if (response.ok) {
                const data = await response.json();
                // Filter out current post
                const filtered = data.filter((post: RelatedPost) => post.post_id !== postId).slice(0, 3);
                setPosts(filtered);
            }
        } catch (error) {
            console.error("Failed to load related posts:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || posts.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link key={post.post_id} href={`/blog/${post.post_id}/${post.slug}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                            {post.featured_image && (
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="font-semibold line-clamp-2 mb-2">{post.title}</h3>
                                {post.excerpt && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {post.excerpt}
                                    </p>
                                )}
                                <div className="flex items-center text-sm text-primary font-medium">
                                    Read more <ArrowRight className="h-4 w-4 ml-1" />
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
