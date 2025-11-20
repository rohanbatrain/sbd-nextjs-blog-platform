'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CreateWebsiteDialog } from '@/components/blog/CreateWebsiteDialog';
import { Globe, ExternalLink, Settings } from 'lucide-react';

interface Website {
    website_id: string;
    name: string;
    subdomain: string;
    description?: string;
    post_count: number;
    created_at: string;
}

export default function MyWebsitesPage() {
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                setWebsites([
                    {
                        website_id: 'web_1',
                        name: 'Tech Blog',
                        subdomain: 'tech-insights',
                        description: 'Latest in technology and software development',
                        post_count: 24,
                        created_at: '2024-01-15T10:00:00Z'
                    },
                    {
                        website_id: 'web_2',
                        name: 'Personal Journal',
                        subdomain: 'my-journal',
                        post_count: 12,
                        created_at: '2024-02-01T10:00:00Z'
                    }
                ]);
            } catch (error) {
                console.error('Failed to fetch websites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWebsites();
    }, []);

    if (loading) {
        return (
            <div className="container py-10 space-y-6">
                <Skeleton className="h-12 w-[200px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-[200px] w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">My Websites</h1>
                        <p className="text-muted-foreground mt-1">{websites.length} websites</p>
                    </div>
                    <CreateWebsiteDialog onWebsiteCreated={() => window.location.reload()} />
                </div>

                {websites.length === 0 ? (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No websites yet</h2>
                            <p className="text-muted-foreground mb-4">
                                Create your first blog website to get started
                            </p>
                            <CreateWebsiteDialog onWebsiteCreated={() => window.location.reload()} />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {websites.map(website => (
                            <Card key={website.website_id} className="hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <Globe className="h-8 w-8 text-primary" />
                                        <Badge>{website.post_count} posts</Badge>
                                    </div>
                                    <CardTitle className="text-xl">{website.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{website.subdomain}.blog.com</p>
                                </CardHeader>
                                <CardContent>
                                    {website.description && (
                                        <p className="text-sm text-muted-foreground mb-4">{website.description}</p>
                                    )}
                                    <div className="flex gap-2">
                                        <Link href={`/blog/${website.website_id}`} className="flex-1">
                                            <Button variant="outline" className="w-full gap-2">
                                                <ExternalLink className="h-4 w-4" />
                                                View
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="icon">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
