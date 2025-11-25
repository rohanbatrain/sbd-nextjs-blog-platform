"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, MessageSquare, TrendingUp, Plus, Edit, Calendar, BarChart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { blogApi } from "@/lib/api";
import { BlogAnalytics, BlogPost, BlogComment, BlogWebsite } from "@/types/blog";
import { useWebsite } from "@/context/WebsiteContext";
import { formatDistanceToNow } from "date-fns";

export default function DashboardClient() {
    const [loading, setLoading] = useState(true);
    const { websiteId, websites } = useWebsite();
    const website = websites.find((w) => w.website_id === websiteId) ?? null;
    const [analytics, setAnalytics] = useState<BlogAnalytics | null>(null);
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
    const [recentComments, setRecentComments] = useState<BlogComment[]>([]);

    useEffect(() => {
        if (!websiteId) {
            // No website selected yet; keep loading false to show placeholder UI
            return;
        }
        setLoading(true);
        const fetchData = async () => {
            try {
                const [analyticsData, postsData, commentsData] = await Promise.all([
                    blogApi.getAnalytics(websiteId),
                    blogApi.getPosts(websiteId, { limit: 5 }),
                    Promise.resolve([] as BlogComment[])
                ]);
                setAnalytics(analyticsData);
                setRecentPosts(postsData);
                setRecentComments(commentsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [websiteId]);

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
                <p className="text-muted-foreground mt-2">Select a website from the sidebar to view the dashboard.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage <strong>{website.name}</strong>, track analytics, and engage with readers
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link href="/my-websites">
                        <Button variant="outline" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Switch Website
                        </Button>
                    </Link>
                    <Link href={`/posts/create?websiteId=${website.website_id}`}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Post
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card data-testid="analytics-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.total_posts || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {analytics?.posts_by_status?.published || 0} published
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.total_views || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime views
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Comments</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.total_comments || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Total comments
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.total_likes || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Total likes
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Posts */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Posts</CardTitle>
                                <CardDescription>Your latest blog posts</CardDescription>
                            </div>
                            <Link href={`/posts?websiteId=${website.website_id}`}>
                                <Button variant="ghost" size="sm">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentPosts.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No posts yet.</p>
                            ) : (
                                recentPosts.map((post) => (
                                    <div key={post.post_id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                        <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{post.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                <span className={post.status === "published" ? "text-emerald-600" : "text-amber-600"}>
                                                    {post.status}
                                                </span> • {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{post.view_count}</p>
                                            <p className="text-xs text-muted-foreground">views</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Comments (Placeholder for now as backend endpoint is missing) */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Comments</CardTitle>
                                <CardDescription>Latest reader engagement</CardDescription>
                            </div>
                            <Link href="/comments">
                                <Button variant="ghost" size="sm">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Recent comments feature coming soon.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href={`/posts/create?websiteId=${website.website_id}`} className="block">
                            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                                <Plus className="h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-medium">New Post</div>
                                    <div className="text-xs text-muted-foreground">Create article</div>
                                </div>
                            </Button>
                        </Link>
                        <Link href={`/posts?websiteId=${website.website_id}`} className="block">
                            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                                <FileText className="h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-medium">My Posts</div>
                                    <div className="text-xs text-muted-foreground">Manage content</div>
                                </div>
                            </Button>
                        </Link>
                        <Link href="/categories" className="block">
                            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                                <Edit className="h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-medium">Categories</div>
                                    <div className="text-xs text-muted-foreground">Organize posts</div>
                                </div>
                            </Button>
                        </Link>
                        <Link href="/scheduled" className="block">
                            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                                <Calendar className="h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-medium">Scheduled</div>
                                    <div className="text-xs text-muted-foreground">Upcoming posts</div>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Analytics Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Analytics Overview</CardTitle>
                    <CardDescription>Your blog performance this month</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-4 p-4 rounded-lg border">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Eye className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Page Views</p>
                                <p className="text-2xl font-bold">{analytics?.total_views || 0}</p>
                                <p className="text-xs text-emerald-600">Lifetime</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg border">
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Likes</p>
                                <p className="text-2xl font-bold">{analytics?.total_likes || 0}</p>
                                <p className="text-xs text-blue-600">Across all posts</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg border">
                            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <BarChart className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Comments</p>
                                <p className="text-2xl font-bold">{analytics?.total_comments || 0}</p>
                                <p className="text-xs text-muted-foreground">Total engagement</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
