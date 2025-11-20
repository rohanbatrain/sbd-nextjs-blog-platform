'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BlogWebsite, BlogPost } from '@/types';
import { PostCard } from '@/components/blog/PostCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, Calendar } from 'lucide-react';

export default function BlogPage() {
    const params = useParams();
    const websiteId = params.id as string;

    const [website, setWebsite] = useState<BlogWebsite | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                setWebsite({
                    website_id: websiteId,
                    name: 'Tech Insights',
                    subdomain: 'techinsights',
                    description: 'Exploring the latest in technology and innovation',
                    owner_id: 'user_1',
                    created_at: '2024-01-01T00:00:00Z',
                    theme: 'modern'
                });

                setPosts([
                    {
                        post_id: 'post_1',
                        website_id: websiteId,
                        title: 'Getting Started with Next.js 14',
                        slug: 'getting-started-nextjs-14',
                        content: 'Full content here...',
                        excerpt: 'Learn how to build modern web applications with Next.js 14 and the new App Router.',
                        featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
                        author_id: 'user_1',
                        status: 'published',
                        published_at: '2024-03-15T10:00:00Z',
                        created_at: '2024-03-15T10:00:00Z',
                        updated_at: '2024-03-15T10:00:00Z',
                        view_count: 1234,
                        categories: ['Web Development', 'React'],
                        tags: ['nextjs', 'react', 'tutorial']
                    },
                    {
                        post_id: 'post_2',
                        website_id: websiteId,
                        title: 'The Future of AI in Web Development',
                        slug: 'future-ai-web-development',
                        content: 'Full content here...',
                        excerpt: 'Exploring how artificial intelligence is transforming the way we build websites.',
                        featured_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
                        author_id: 'user_1',
                        status: 'published',
                        published_at: '2024-03-10T10:00:00Z',
                        created_at: '2024-03-10T10:00:00Z',
                        updated_at: '2024-03-10T10:00:00Z',
                        view_count: 892,
                        categories: ['AI', 'Web Development'],
                        tags: ['ai', 'machine-learning', 'web']
                    },
                    {
                        post_id: 'post_3',
                        website_id: websiteId,
                        title: 'Building Scalable APIs with FastAPI',
                        slug: 'building-scalable-apis-fastapi',
                        content: 'Full content here...',
                        excerpt: 'A comprehensive guide to creating high-performance APIs using Python and FastAPI.',
                        featured_image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800',
                        author_id: 'user_1',
                        status: 'published',
                        published_at: '2024-03-05T10:00:00Z',
                        created_at: '2024-03-05T10:00:00Z',
                        updated_at: '2024-03-05T10:00:00Z',
                        view_count: 567,
                        categories: ['Backend', 'Python'],
                        tags: ['fastapi', 'python', 'api']
                    }
                ]);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        if (websiteId) {
            fetchData();
        }
    }, [websiteId]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="container py-10 space-y-8">
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!website) return <div>Blog not found</div>;

    return (
        <div className="min-h-screen bg-background">
            {/* Blog Header */}
            <div className="bg-muted/30 border-b">
                <div className="container py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold mb-4">{website.name}</h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            {website.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Globe className="h-4 w-4" />
                                <span>{website.subdomain}.bloghub.com</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Since {new Date(website.created_at).getFullYear()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts */}
            <div className="container py-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold">Latest Posts</h2>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map(post => (
                        <PostCard key={post.post_id} post={post} websiteId={websiteId} />
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-lg font-semibold">No posts found</h3>
                        <p className="text-muted-foreground">Try adjusting your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
