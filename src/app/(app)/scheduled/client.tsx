"use client";
import { useEffect, useState } from 'react';
import { useCurrentWebsite } from "@/hooks/useCurrentWebsite";
import { blogApi } from '@/lib/api';
import { BlogPost } from '@/types/blog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ScheduledClient() {
    const website = useCurrentWebsite();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!website) {
            // No website selected yet; show placeholder UI
            setLoading(false);
            return;
        }
        const fetchScheduled = async () => {
            try {
                const data = await blogApi.getPosts(website.website_id, { status: 'scheduled' });
                setPosts(data);
            } catch (e) {
                console.error('Failed to fetch scheduled posts', e);
            } finally {
                setLoading(false);
            }
        };
        fetchScheduled();
    }, [website?.website_id]);

    if (!website) {
        return <div className="p-4">No website selected. Please select a website from the sidebar.</div>;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="animate-spin mr-2" /> Loading scheduled posts...
            </div>
        );
    }

    if (posts.length === 0) {
        return <div className="p-4">No scheduled posts found.</div>;
    }

    return (
        <div className="space-y-4 p-4">
            {posts.map((post) => (
                <Card key={post.post_id}>
                    <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                            Scheduled for: {post.scheduled_publish_at ?? 'N/A'}
                        </span>
                        <Link href={`/posts/${post.post_id}?websiteId=${websiteId}`}>
                            <Button variant="outline" size="sm">View</Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
