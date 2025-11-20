'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const seoSchema = z.object({
    meta_title: z.string().min(10).max(60, 'Title should be 10-60 characters'),
    meta_description: z.string().min(50).max(160, 'Description should be 50-160 characters'),
    meta_keywords: z.string().optional(),
    og_title: z.string().optional(),
    og_description: z.string().optional(),
    og_image: z.string().url().optional().or(z.literal('')),
    twitter_card: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
    canonical_url: z.string().url().optional().or(z.literal('')),
    robots: z.string().optional(),
});

type SEOFormData = z.infer<typeof seoSchema>;

interface SEOFieldsProps {
    initialData?: Partial<SEOFormData>;
    onSave: (data: SEOFormData) => Promise<void>;
}

export function SEOFields({ initialData, onSave }: SEOFieldsProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<SEOFormData>({
        resolver: zodResolver(seoSchema),
        defaultValues: {
            meta_title: initialData?.meta_title || '',
            meta_description: initialData?.meta_description || '',
            meta_keywords: initialData?.meta_keywords || '',
            og_title: initialData?.og_title || '',
            og_description: initialData?.og_description || '',
            og_image: initialData?.og_image || '',
            twitter_card: initialData?.twitter_card || 'summary',
            canonical_url: initialData?.canonical_url || '',
            robots: initialData?.robots || 'index, follow',
        },
    });

    const onSubmit = async (data: SEOFormData) => {
        setLoading(true);
        try {
            await onSave(data);
        } catch (error) {
            console.error('Failed to save SEO data:', error);
        } finally {
            setLoading(false);
        }
    };

    const metaTitle = form.watch('meta_title');
    const metaDescription = form.watch('meta_description');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic SEO</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="meta_title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your page title..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value.length}/60 characters - Appears in search results
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="meta_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief description of your page..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value.length}/160 characters - Appears below title in search results
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="meta_keywords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta Keywords (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="keyword1, keyword2, keyword3" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Comma-separated keywords
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="canonical_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Canonical URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/page" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Preferred URL for this content
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="robots"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Robots Meta Tag</FormLabel>
                                    <FormControl>
                                        <Input placeholder="index, follow" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Controls search engine indexing
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Open Graph (Social Media)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="og_title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OG Title (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title for social media shares" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Leave empty to use meta title
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="og_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OG Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Description for social media shares" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Leave empty to use meta description
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="og_image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OG Image URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/image.jpg" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Image shown when shared on social media (1200x630px recommended)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="twitter_card"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Twitter Card Type</FormLabel>
                                    <FormControl>
                                        <select
                                            className="w-full p-2 border rounded-md"
                                            {...field}
                                        >
                                            <option value="summary">Summary</option>
                                            <option value="summary_large_image">Summary Large Image</option>
                                            <option value="app">App</option>
                                            <option value="player">Player</option>
                                        </select>
                                    </FormControl>
                                    <FormDescription>
                                        How content appears on Twitter
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium mb-2">Google Search Result Preview</h3>
                                <div className="border rounded-lg p-4 bg-muted/30">
                                    <div className="text-sm text-blue-600 mb-1">
                                        {metaTitle || 'Your page title will appear here'}
                                    </div>
                                    <div className="text-xs text-green-700 mb-2">
                                        https://example.com/page
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {metaDescription || 'Your meta description will appear here...'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Social Media Preview</h3>
                                <div className="border rounded-lg overflow-hidden bg-muted/30">
                                    {form.watch('og_image') && (
                                        <div className="h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                            <span className="text-sm text-muted-foreground">Image Preview</span>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="font-semibold mb-1">
                                            {form.watch('og_title') || metaTitle || 'Your title'}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {form.watch('og_description') || metaDescription || 'Your description'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save SEO Settings
                </Button>
            </form>
        </Form>
    );
}
