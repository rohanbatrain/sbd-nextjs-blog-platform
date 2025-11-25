"use client";

import { useEffect, useState } from "react";
import { useCurrentWebsite } from "@/hooks/useCurrentWebsite";
import Link from "next/link";
import { blogApi } from "@/lib/api";
import { BlogComment, BlogWebsite } from "@/types/blog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, Check, X, AlertTriangle, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function CommentsClient() {
    const website = useCurrentWebsite();

    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<BlogComment[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        if (!website) {
            // No website selected yet; show placeholder UI
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                const commentsData = await blogApi.getAllComments(website.website_id, {
                    status: statusFilter === "all" ? undefined : statusFilter
                });
                setComments(commentsData);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [website?.website_id, statusFilter]);

    const handleModerate = async (commentId: string, action: 'approve' | 'reject' | 'spam') => {
        toast.info(`Moderation action '${action}' not yet implemented in backend.`);
        setComments(comments.map(c => c.comment_id === commentId ? { ...c, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'spam' } : c));
    };

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
                <Link href="/dashboard">
                    <Button className="mt-4">Go to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline flex items-center gap-1 mb-2">
                        <ArrowLeft className="h-3 w-3" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
                    <p className="text-muted-foreground">
                        Moderate comments for {website.name}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="spam">Spam</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Author</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No comments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            comments.map((comment) => (
                                <TableRow key={comment.comment_id}>
                                    <TableCell>
                                        <div className="font-medium">{comment.author_name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {comment.author_email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[400px] truncate" title={comment.content}>
                                            {comment.content}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            on Post ID: {comment.post_id.substring(0, 8)}...
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                comment.status === "approved"
                                                    ? "default"
                                                    : comment.status === "pending"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                            className={
                                                comment.status === "approved" ? "bg-emerald-600 hover:bg-emerald-700" :
                                                    comment.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""
                                            }
                                        >
                                            {comment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {comment.status === 'pending' && (
                                                <>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => handleModerate(comment.comment_id, 'approve')} title="Approve">
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleModerate(comment.comment_id, 'reject')} title="Reject">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            {comment.status !== 'spam' && (
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-600" onClick={() => handleModerate(comment.comment_id, 'spam')} title="Mark as Spam">
                                                    <AlertTriangle className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
