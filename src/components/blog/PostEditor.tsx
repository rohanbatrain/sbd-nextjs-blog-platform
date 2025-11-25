"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, History, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { blogApi } from "@/lib/api";
import { BlogPost, BlogWebsite } from "@/types/blog";
import { toast } from "sonner";

interface PostEditorProps {
    websiteId: string;
    initialPost?: BlogPost;
    mode: "create" | "edit";
}

export function PostEditor({ websiteId, initialPost, mode }: PostEditorProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [title, setTitle] = useState(initialPost?.title || "");
    const [status, setStatus] = useState(initialPost?.status || "draft");
    const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");

    // Editor setup
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Write something amazing...",
            }),
        ],
        content: initialPost?.content || "",
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4",
            },
        },
        onUpdate: ({ editor }) => {
            // Trigger auto-save logic here (debounced)
            handleAutoSave(editor.getHTML());
        },
    });

    // Debounced Auto-save
    const handleAutoSave = useCallback(
        debounce(async (content: string) => {
            if (mode === "edit" && initialPost) {
                try {
                    await blogApi.autosavePost(websiteId, initialPost.post_id, content, title);
                    setLastSaved(new Date());
                } catch (error) {
                    console.error("Auto-save failed", error);
                }
            }
        }, 2000),
        [mode, initialPost, websiteId, title]
    );

    const handleSave = async () => {
        if (!editor) return;
        setIsSaving(true);
        try {
            const content = editor.getHTML();
            const postData = {
                title,
                content,
                excerpt,
                status: status as any,
                // Add other fields like categories, tags, SEO here
            };

            if (mode === "create") {
                const newPost = await blogApi.createPost(websiteId, postData);
                toast.success("Post created successfully");
                router.push(`/posts/${newPost.post_id}/edit?websiteId=${websiteId}`);
            } else if (initialPost) {
                await blogApi.updatePost(websiteId, initialPost.post_id, postData);
                toast.success("Post updated successfully");
                setLastSaved(new Date());
            }
        } catch (error) {
            console.error("Failed to save post:", error);
            toast.error("Failed to save post");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="border-b bg-background px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href={`/posts?websiteId=${websiteId}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <span className="font-semibold">{mode === "create" ? "New Post" : "Edit Post"}</span>
                        {lastSaved && (
                            <span className="text-xs text-muted-foreground">
                                Saved {lastSaved.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={status} onValueChange={(val) => setStatus(val as any)}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                    </Select>

                    {mode === "edit" && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" title="Version History">
                                    <History className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Version History</SheetTitle>
                                    <SheetDescription>
                                        View and restore previous versions of this post.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-4">
                                    {/* Version list would go here */}
                                    <p className="text-sm text-muted-foreground">Version history implementation pending backend integration.</p>
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}

                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save
                            </>
                        )}
                    </Button>
                </div>
            </header>

            {/* Main Editor Area */}
            <div className="flex-1 overflow-hidden flex">
                <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post Title"
                        className="text-4xl font-bold border-none shadow-none px-0 focus-visible:ring-0 mb-4 placeholder:text-muted-foreground/50 h-auto py-2"
                    />

                    <Tabs defaultValue="editor" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="editor">Editor</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="editor" className="min-h-[500px]">
                            <EditorContent editor={editor} />
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Excerpt</label>
                                <Textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    placeholder="Brief summary of the post..."
                                    rows={4}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Used for SEO and post previews.
                                </p>
                            </div>
                            {/* Add Categories, Tags, Featured Image inputs here */}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
