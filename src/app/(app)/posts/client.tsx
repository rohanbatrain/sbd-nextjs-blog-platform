"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentWebsite } from "@/hooks/useCurrentWebsite";
import Link from "next/link";
import { blogApi } from "@/lib/api";
import { BlogPost, BlogWebsite } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, FileText, Search, Loader2, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function PostsClient() {
    const router = useRouter();
    const website = useCurrentWebsite();

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!website) {
            // No website selected yet; UI will show placeholder
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                const postsData = await blogApi.getPosts(website.website_id, {
                    status: statusFilter === "all" ? undefined : statusFilter
                });
                setPosts(postsData);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [website?.website_id, statusFilter]);

    const handleDelete = async (postId: string) => {
        if (!website || !confirm("Are you sure you want to delete this post?")) return;
        try {
            await blogApi.deletePost(website.website_id, postId);
            setPosts(posts.filter((p) => p.post_id !== postId));
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert("Failed to delete post");
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                    <p className="text-muted-foreground">
                        Manage posts for {website.name}
                    </p>
                </div>
                <Link href={`/posts/create?websiteId=${website.website_id}`}>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Post
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table data-testid="posts-list">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Stats</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPosts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No posts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPosts.map((post) => (
                                <TableRow key={post.post_id}>
                                    <TableCell>
                                        <div className="font-medium">{post.title}</div>
                                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                                            {post.slug}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                post.status === "published"
                                                    ? "default" // Map to a success variant if available, else default
                                                    : post.status === "draft"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                            className={
                                                post.status === "published" ? "bg-emerald-600 hover:bg-emerald-700" :
                                                    post.status === "draft" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""
                                            }
                                        >
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span title="Views" className="flex items-center gap-1">
                                                <FileText className="h-3 w-3" /> {post.view_count}
                                            </span>
                                            {/* Add more stats if needed */}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/posts/${post.post_id}/edit?websiteId=${website.website_id}`}>
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>View on site</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(post.post_id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
