'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { api, endpoints } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const commentSchema = z.object({
    author_name: z.string().min(2, 'Name must be at least 2 characters'),
    author_email: z.string().email('Invalid email address'),
    content: z.string().min(10, 'Comment must be at least 10 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
    websiteId: string;
    postId: string;
    onCommentAdded?: () => void;
}

export function CommentForm({ websiteId, postId, onCommentAdded }: CommentFormProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            author_name: '',
            author_email: '',
            content: '',
        },
    });

    const onSubmit = async (data: CommentFormData) => {
        setLoading(true);
        try {
            await api.post(endpoints.comments.create(websiteId, postId), data);

            form.reset();
            onCommentAdded?.();
        } catch (error: any) {
            console.error('Failed to post comment:', error);
            alert(error.response?.data?.detail || 'Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="author_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="author_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="your@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Share your thoughts..."
                                        className="min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Post Comment
                    </Button>
                </form>
            </Form>
        </div>
    );
}
