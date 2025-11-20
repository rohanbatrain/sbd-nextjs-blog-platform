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
import { Calendar, Loader2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

const schedulePostSchema = z.object({
    scheduled_at: z.string().min(1, 'Schedule time is required'),
});

type SchedulePostFormData = z.infer<typeof schedulePostSchema>;

interface SchedulePostDialogProps {
    postId: string;
    onScheduled?: () => void;
}

export function SchedulePostDialog({ postId, onScheduled }: SchedulePostDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<SchedulePostFormData>({
        resolver: zodResolver(schedulePostSchema),
        defaultValues: {
            scheduled_at: '',
        },
    });

    const onSubmit = async (data: SchedulePostFormData) => {
        setLoading(true);
        try {
            // API call would go here
            await new Promise(resolve => setTimeout(resolve, 1000));

            setOpen(false);
            form.reset();
            onScheduled?.();
            router.refresh();
        } catch (error: any) {
            console.error('Failed to schedule post:', error);
            alert('Failed to schedule post');
        } finally {
            setLoading(false);
        }
    };

    const minDateTime = new Date().toISOString().slice(0, 16);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Post
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Schedule Post</DialogTitle>
                    <DialogDescription>
                        Choose when this post should be published
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="scheduled_at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Publish Date & Time</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            min={minDateTime}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Post will be automatically published at this time
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="bg-muted/30 rounded-lg p-4">
                            <h4 className="font-medium mb-2">Scheduling Tips</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Best times: Weekdays 9 AM - 5 PM</li>
                                <li>• Avoid late nights and early mornings</li>
                                <li>• You can reschedule or cancel anytime</li>
                            </ul>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Schedule Post
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
