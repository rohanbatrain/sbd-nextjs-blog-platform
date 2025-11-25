"use client";

import { useCurrentWebsite } from "@/hooks/useCurrentWebsite";
import dynamic from "next/dynamic";
const PostEditor = dynamic(() => import("@/components/blog/PostEditor").then(mod => mod.PostEditor), { ssr: false });
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreatePostClient() {
    const website = useCurrentWebsite();

    if (!website) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">No Website Selected</h1>
                <p className="text-muted-foreground mt-2">Please select a website to create a post for.</p>
                <Link href="/dashboard">
                    <Button className="mt-4">Go to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return <PostEditor websiteId={website.website_id} mode="create" />;
}
