"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCurrentWebsite } from "@/hooks/useCurrentWebsite";
import dynamic from "next/dynamic";
const PostEditor = dynamic(() => import("@/components/blog/PostEditor").then(mod => mod.PostEditor), { ssr: false });
import { blogApi } from "@/lib/api";
import { BlogPost } from "@/types/blog";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditPostClient() {
    const params = useParams();
    const website = useCurrentWebsite();
    const postId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!website || !postId) return;
            try {
                // Optimization: fetch directly by slug if possible, but here we have ID.
                // We might need an endpoint to get post by ID directly without listing all.
                // For now, keeping existing logic but using website.website_id
                const posts = await blogApi.getPosts(website.website_id, { limit: 100 });
                const foundPost = posts.find(p => p.post_id === postId);

                if (foundPost) {
                    const fullPost = await blogApi.getPost(website.website_id, foundPost.slug);
                    setPost(fullPost);
                }
            } catch (error) {
                console.error("Failed to fetch post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [website?.website_id, postId]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!website) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">No Website Selected</h1>
                <Link href="/dashboard">
                    <Button className="mt-4">Go to Dashboard</Button>
                </Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">Post Not Found</h1>
                <Link href={`/posts?websiteId=${website.website_id}`}>
                    <Button className="mt-4">Back to Posts</Button>
                </Link>>
            </div>
        );
    }

    return <PostEditor websiteId={website.website_id} initialPost={post} mode="edit" />;
}
