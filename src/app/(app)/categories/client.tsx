"use client";

import { useEffect, useState } from "react";
import { useCurrentWebsite } from "@/hooks/useCurrentWebsite";
import Link from "next/link";
import { blogApi } from "@/lib/api";
import { BlogWebsite, BlogCategory } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Loader2, ArrowLeft, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CategoriesClient() {
    const website = useCurrentWebsite();

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!website) {
            // No website selected yet; UI will show placeholder
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const categoriesData = await blogApi.getCategories(website.website_id);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Failed to load categories");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [website?.website_id]);

    const resetForm = () => {
        setName("");
        setSlug("");
        setDescription("");
        setEditingCategory(null);
    };

    const handleCreate = async () => {
        if (!website || !name.trim()) {
            toast.error("Category name is required");
            return;
        }

        setSaving(true);
        try {
            const newCategory = await blogApi.createCategory(website.website_id, {
                name: name.trim(),
                slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
                description: description.trim()
            });
            setCategories([...categories, newCategory]);
            setIsCreateDialogOpen(false);
            resetForm();
            toast.success("Category created successfully");
        } catch (error) {
            console.error("Failed to create category:", error);
            toast.error("Failed to create category");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = async () => {
        if (!website || !editingCategory || !name.trim()) {
            toast.error("Category name is required");
            return;
        }

        setSaving(true);
        try {
            const updatedCategory = await blogApi.updateCategory(
                website.website_id,
                editingCategory.category_id,
                {
                    name: name.trim(),
                    slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
                    description: description.trim()
                }
            );
            setCategories(categories.map(c =>
                c.category_id === editingCategory.category_id ? updatedCategory : c
            ));
            setIsEditDialogOpen(false);
            resetForm();
            toast.success("Category updated successfully");
        } catch (error) {
            console.error("Failed to update category:", error);
            toast.error("Failed to update category");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (categoryId: string) => {
        if (!website || !confirm("Are you sure you want to delete this category?")) return;

        try {
            await blogApi.deleteCategory(website.website_id, categoryId);
            setCategories(categories.filter(c => c.category_id !== categoryId));
            toast.success("Category deleted successfully");
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error("Failed to delete category");
        }
    };

    const openEditDialog = (category: BlogCategory) => {
        setEditingCategory(category);
        setName(category.name);
        setSlug(category.slug);
        setDescription(category.description || "");
        setIsEditDialogOpen(true);
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
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">
                        Organize posts for {website.name}
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2" onClick={resetForm}>
                            <Plus className="h-4 w-4" />
                            New Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Category</DialogTitle>
                            <DialogDescription>
                                Add a new category to organize your blog posts.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Technology"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="technology"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to auto-generate from name
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Posts about technology and innovation"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate} disabled={saving}>
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="categories-list">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Posts</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <FolderOpen className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">No categories yet.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.category_id}>
                                    <TableCell>
                                        <div className="font-medium">{category.name}</div>
                                        {category.description && (
                                            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                                                {category.description}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-muted px-2 py-1 rounded">
                                            {category.slug}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {category.post_count} {category.post_count === 1 ? 'post' : 'posts'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(category.created_at), { addSuffix: true })}
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
                                                <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(category.category_id)}
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update category details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Technology"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-slug">Slug</Label>
                            <Input
                                id="edit-slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="technology"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Posts about technology and innovation"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
