'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateCategoryDialog } from '@/components/blog/CreateCategoryDialog';
import { Folder, FileText, Trash2 } from 'lucide-react';

interface Category {
    category_id: string;
    name: string;
    slug: string;
    description?: string;
    post_count: number;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const websiteId = 'web_1'; // This would come from context/params

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                setCategories([
                    {
                        category_id: 'cat_1',
                        name: 'Technology',
                        slug: 'technology',
                        description: 'Posts about technology and software',
                        post_count: 15
                    },
                    {
                        category_id: 'cat_2',
                        name: 'Tutorials',
                        slug: 'tutorials',
                        description: 'Step-by-step guides',
                        post_count: 8
                    },
                    {
                        category_id: 'cat_3',
                        name: 'News',
                        slug: 'news',
                        post_count: 12
                    }
                ]);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="container py-10 space-y-6">
                <Skeleton className="h-12 w-[200px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[150px] w-full" />
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
                        <h1 className="text-3xl font-bold">Categories</h1>
                        <p className="text-muted-foreground mt-1">{categories.length} categories</p>
                    </div>
                    <CreateCategoryDialog websiteId={websiteId} onCategoryCreated={() => window.location.reload()} />
                </div>

                {categories.length === 0 ? (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No categories yet</h2>
                            <p className="text-muted-foreground mb-4">
                                Create categories to organize your blog posts
                            </p>
                            <CreateCategoryDialog websiteId={websiteId} onCategoryCreated={() => window.location.reload()} />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map(category => (
                            <Card key={category.category_id} className="hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <Folder className="h-8 w-8 text-primary" />
                                        <Badge>{category.post_count} posts</Badge>
                                    </div>
                                    <CardTitle className="text-xl">{category.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">/{category.slug}</p>
                                </CardHeader>
                                <CardContent>
                                    {category.description && (
                                        <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                                    )}
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1 gap-2">
                                            <FileText className="h-4 w-4" />
                                            View Posts
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
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
