'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { api, endpoints } from '@/lib/api';
import { Plus, Loader2 } from 'lucide-react';

const websiteSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    subdomain: z.string().min(3, 'Subdomain must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
    description: z.string().optional(),
    custom_domain: z.string().optional(),
});

type WebsiteFormData = z.infer<typeof websiteSchema>;

interface CreateWebsiteDialogProps {
    onWebsiteCreated?: () => void;
}

export function CreateWebsiteDialog({ onWebsiteCreated }: CreateWebsiteDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<WebsiteFormData>({
        resolver: zodResolver(websiteSchema),
        defaultValues: {
            name: '',
            subdomain: '',
            description: '',
            custom_domain: '',
        },
    });

    const onSubmit = async (data: WebsiteFormData) => {
        setLoading(true);
        try {
            await api.post(endpoints.websites.create, data);

            setOpen(false);
            form.reset();
            onWebsiteCreated?.();
            router.refresh();
        } catch (error: any) {
            console.error('Failed to create website:', error);
            alert(error.response?.data?.detail || 'Failed to create website');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Website
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Blog Website</DialogTitle>
                    <DialogDescription>
                        Set up a new blog website with your own subdomain.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="My Awesome Blog" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subdomain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subdomain</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input placeholder="my-blog" {...field} />
                                            <span className="text-sm text-muted-foreground">.blog.com</span>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Your blog will be available at {field.value || 'your-subdomain'}.blog.com
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="A blog about..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="custom_domain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Custom Domain (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="blog.example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Use your own domain instead of a subdomain
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Create Website
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
