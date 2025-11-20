'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BlogPost } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Eye, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PostDetailPage() {
    const params = useParams();
    const websiteId = params.id as string;
    const slug = params.slug as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                setPost({
                    post_id: 'post_1',
                    website_id: websiteId,
                    title: 'Getting Started with Next.js 14',
                    slug: slug,
                    content: `# Introduction

Next.js 14 introduces several groundbreaking features that make building modern web applications easier and more efficient than ever before.

## What's New in Next.js 14

The latest version of Next.js brings significant improvements to the developer experience and application performance.

### Server Actions

Server Actions are a new way to handle form submissions and data mutations directly on the server, without the need for API routes.

\`\`\`typescript
async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title')
  // Handle post creation
}
\`\`\`

### Partial Prerendering

This experimental feature combines the best of static and dynamic rendering, allowing you to have static shells with dynamic content.

## Getting Started

To create a new Next.js 14 project, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

## Conclusion

Next.js 14 represents a major step forward in web development, making it easier to build fast, scalable applications.`,
                    excerpt: 'Learn how to build modern web applications with Next.js 14 and the new App Router.',
                    featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
                    author_id: 'user_1',
                    status: 'published',
                    published_at: '2024-03-15T10:00:00Z',
                    created_at: '2024-03-15T10:00:00Z',
                    updated_at: '2024-03-15T10:00:00Z',
                    view_count: 1234,
                    categories: ['Web Development', 'React'],
                    tags: ['nextjs', 'react', 'tutorial']
                });
            } catch (error) {
                console.error('Failed to fetch post', error);
            } finally {
                setLoading(false);
            }
        };

        if (websiteId && slug) {
            fetchPost();
        }
    }, [websiteId, slug]);

    if (loading) {
        return (
            <div className="container max-w-4xl py-10 space-y-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-[400px] w-full" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        );
    }

    if (!post) return <div>Post not found</div>;

    return (
        <article className="min-h-screen bg-background pb-20">
            {/* Featured Image */}
            {post.featured_image && (
                <div className="h-[400px] w-full bg-muted relative">
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
            )}

            <div className="container max-w-4xl -mt-20 relative z-10">
                {/* Header */}
                <div className="bg-background rounded-2xl p-8 shadow-lg mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.map(cat => (
                            <Badge key={cat} variant="secondary">
                                {cat}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback>AU</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">Author Name</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDistanceToNow(new Date(post.published_at!), { addSuffix: true })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        5 min read
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {post.view_count} views
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                                <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                    <div className="whitespace-pre-wrap leading-relaxed">
                        {post.content}
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="px-3 py-1">
                            #{tag}
                        </Badge>
                    ))}
                </div>

                {/* Author Bio */}
                <div className="bg-muted/30 rounded-2xl p-8 border">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-lg">AU</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">About the Author</h3>
                            <p className="text-muted-foreground mb-4">
                                A passionate developer and writer sharing insights about web development,
                                technology, and software engineering best practices.
                            </p>
                            <Button variant="outline" size="sm">Follow</Button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
