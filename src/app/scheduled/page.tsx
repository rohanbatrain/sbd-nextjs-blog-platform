'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ScheduledPost {
    post_id: string;
    title: string;
    scheduled_at: string;
    status: 'pending' | 'published' | 'failed';
    website_name: string;
}

export default function ScheduledPostsPage() {
    const [posts, setPosts] = useState<ScheduledPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScheduledPosts = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                setPosts([
                    {
                        post_id: 'post_1',
                        title: 'Getting Started with Next.js 14',
                        scheduled_at: '2024-03-25T10:00:00Z',
                        status: 'pending',
                        website_name: 'Tech Blog'
                    },
                    {
                        post_id: 'post_2',
                        title: 'Building a Modern Blog Platform',
                        scheduled_at: '2024-03-20T14:00:00Z',
                        status: 'published',
                        website_name: 'Tech Blog'
                    },
                    {
                        post_id: 'post_3',
                        title: 'TypeScript Best Practices',
                        scheduled_at: '2024-03-18T09:00:00Z',
                        status: 'failed',
                        website_name: 'Dev Journal'
                    }
                ]);
            } catch (error) {
                console.error('Failed to fetch scheduled posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScheduledPosts();
    }, []);

    if (loading) {
        return (
            <div className="container py-10 space-y-6">
                <Skeleton className="h-12 w-[200px]" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[100px] w-full" />
                    ))}
                </div>
            </div>
        );
    }

    const pendingPosts = posts.filter(p => p.status === 'pending');
    const publishedPosts = posts.filter(p => p.status === 'published');
    const failedPosts = posts.filter(p => p.status === 'failed');

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4 text-blue-500" />;
            case 'published':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-destructive" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
            pending: 'secondary',
            published: 'default',
            failed: 'destructive'
        };
        return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
    };

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Scheduled Posts</h1>
                    <p className="text-muted-foreground">
                        Manage your scheduled blog posts
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{pendingPosts.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Published
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{publishedPosts.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Failed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-destructive">{failedPosts.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                        <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
                        <TabsTrigger value="pending">Pending ({pendingPosts.length})</TabsTrigger>
                        <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
                        <TabsTrigger value="failed">Failed ({failedPosts.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-6">
                        <div className="space-y-4">
                            {posts.map(post => (
                                <Card key={post.post_id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {getStatusIcon(post.status)}
                                                    <h3 className="font-semibold text-lg">{post.title}</h3>
                                                    {getStatusBadge(post.status)}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(post.scheduled_at).toLocaleString()}
                                                    </span>
                                                    <span>
                                                        {post.status === 'pending'
                                                            ? `In ${formatDistanceToNow(new Date(post.scheduled_at))}`
                                                            : formatDistanceToNow(new Date(post.scheduled_at), { addSuffix: true })
                                                        }
                                                    </span>
                                                    <Badge variant="outline">{post.website_name}</Badge>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {post.status === 'pending' && (
                                                    <>
                                                        <Button variant="outline" size="sm">
                                                            Edit Schedule
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            Cancel
                                                        </Button>
                                                    </>
                                                )}
                                                {post.status === 'failed' && (
                                                    <Button variant="outline" size="sm">
                                                        Retry
                                                    </Button>
                                                )}
                                                {post.status === 'published' && (
                                                    <Button variant="outline" size="sm">
                                                        View Post
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="pending" className="mt-6">
                        <div className="space-y-4">
                            {pendingPosts.map(post => (
                                <Card key={post.post_id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {getStatusIcon(post.status)}
                                                    <h3 className="font-semibold text-lg">{post.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(post.scheduled_at).toLocaleString()}
                                                    </span>
                                                    <span>
                                                        In {formatDistanceToNow(new Date(post.scheduled_at))}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    Edit Schedule
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="published" className="mt-6">
                        <div className="space-y-4">
                            {publishedPosts.map(post => (
                                <Card key={post.post_id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {getStatusIcon(post.status)}
                                                    <h3 className="font-semibold text-lg">{post.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span>
                                                        Published {formatDistanceToNow(new Date(post.scheduled_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                View Post
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="failed" className="mt-6">
                        <div className="space-y-4">
                            {failedPosts.map(post => (
                                <Card key={post.post_id} className="border-destructive/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {getStatusIcon(post.status)}
                                                    <h3 className="font-semibold text-lg">{post.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span>
                                                        Failed {formatDistanceToNow(new Date(post.scheduled_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-destructive mt-2">
                                                    Publishing failed. Please check your settings and try again.
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Retry
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
