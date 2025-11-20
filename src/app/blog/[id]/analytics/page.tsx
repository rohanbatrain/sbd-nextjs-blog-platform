'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Eye, Heart, MessageCircle, TrendingUp, Users } from 'lucide-react';

interface BlogAnalytics {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalSubscribers: number;
    viewsGrowth: number;
    topPosts: Array<{
        post_id: string;
        title: string;
        views: number;
        likes: number;
        comments: number;
    }>;
    viewsOverTime: Array<{
        date: string;
        views: number;
        likes: number;
    }>;
    categoryDistribution: Array<{
        category: string;
        count: number;
    }>;
}

export default function BlogAnalyticsPage() {
    const params = useParams();
    const websiteId = params.id as string;
    const [analytics, setAnalytics] = useState<BlogAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                setAnalytics({
                    totalViews: 15420,
                    totalLikes: 2340,
                    totalComments: 567,
                    totalSubscribers: 1234,
                    viewsGrowth: 23.5,
                    topPosts: [
                        {
                            post_id: 'post_1',
                            title: 'Getting Started with Next.js 14',
                            views: 3420,
                            likes: 456,
                            comments: 89
                        },
                        {
                            post_id: 'post_2',
                            title: 'Building a Modern Blog Platform',
                            views: 2890,
                            likes: 389,
                            comments: 67
                        },
                        {
                            post_id: 'post_3',
                            title: 'TypeScript Best Practices',
                            views: 2340,
                            likes: 312,
                            comments: 45
                        }
                    ],
                    viewsOverTime: [
                        { date: 'Jan', views: 1200, likes: 180 },
                        { date: 'Feb', views: 1800, likes: 250 },
                        { date: 'Mar', views: 2400, likes: 340 },
                        { date: 'Apr', views: 3100, likes: 420 },
                        { date: 'May', views: 3900, likes: 580 },
                        { date: 'Jun', views: 5020, likes: 720 },
                    ],
                    categoryDistribution: [
                        { category: 'Technology', count: 45 },
                        { category: 'Tutorials', count: 32 },
                        { category: 'News', count: 28 },
                        { category: 'Reviews', count: 15 },
                    ]
                });
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [websiteId]);

    if (loading) {
        return (
            <div className="container py-10 space-y-6">
                <Skeleton className="h-12 w-[200px]" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-[120px] w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Blog Analytics</h1>
                    <p className="text-muted-foreground">
                        Track your blog's performance and engagement
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Views
                            </CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</div>
                            <p className="text-xs text-green-600 mt-1">
                                +{analytics.viewsGrowth}% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Likes
                            </CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{analytics.totalLikes.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {((analytics.totalLikes / analytics.totalViews) * 100).toFixed(1)}% engagement rate
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Comments
                            </CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{analytics.totalComments.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across all posts
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Subscribers
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{analytics.totalSubscribers.toLocaleString()}</div>
                            <p className="text-xs text-green-600 mt-1">
                                +15% this month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="top-posts">Top Posts</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Views Over Time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={analytics.viewsOverTime}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                                            <Line type="monotone" dataKey="likes" stroke="#8b5cf6" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Category Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={analytics.categoryDistribution}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="category" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#3b82f6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="top-posts" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.topPosts.map((post, index) => (
                                        <div key={post.post_id} className="flex items-center gap-4 p-4 border rounded-lg">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 font-bold text-primary">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{post.title}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {post.views.toLocaleString()} views
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="h-3 w-3" />
                                                        {post.likes.toLocaleString()} likes
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle className="h-3 w-3" />
                                                        {post.comments} comments
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="categories" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Posts by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.categoryDistribution.map(cat => (
                                        <div key={cat.category} className="flex items-center justify-between p-4 border rounded-lg">
                                            <span className="font-medium">{cat.category}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="w-48 bg-muted rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{
                                                            width: `${(cat.count / Math.max(...analytics.categoryDistribution.map(c => c.count))) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm text-muted-foreground w-12 text-right">
                                                    {cat.count} posts
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
