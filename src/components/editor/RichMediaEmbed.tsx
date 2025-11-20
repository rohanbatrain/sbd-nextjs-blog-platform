"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Youtube, Image, FileVideo, Link as LinkIcon, Code } from "lucide-react";

interface RichMediaEmbedProps {
    onEmbed: (type: string, content: string) => void;
}

export function RichMediaEmbed({ onEmbed }: RichMediaEmbedProps) {
    const [open, setOpen] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [embedCode, setEmbedCode] = useState("");

    const handleYouTubeEmbed = () => {
        // Extract YouTube video ID from URL
        const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        if (videoId) {
            const iframe = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            onEmbed("youtube", iframe);
            setYoutubeUrl("");
            setOpen(false);
        }
    };

    const handleImageEmbed = () => {
        if (imageUrl) {
            onEmbed("image", `<img src="${imageUrl}" alt="Embedded image" class="max-w-full h-auto rounded-lg" />`);
            setImageUrl("");
            setOpen(false);
        }
    };

    const handleVideoEmbed = () => {
        if (videoUrl) {
            onEmbed("video", `<video controls class="max-w-full h-auto rounded-lg"><source src="${videoUrl}" type="video/mp4" /></video>`);
            setVideoUrl("");
            setOpen(false);
        }
    };

    const handleCustomEmbed = () => {
        if (embedCode) {
            onEmbed("custom", embedCode);
            setEmbedCode("");
            setOpen(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="gap-2"
            >
                <LinkIcon className="h-4 w-4" />
                Embed Media
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Embed Rich Media</DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="youtube" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="youtube">
                                <Youtube className="h-4 w-4 mr-2" />
                                YouTube
                            </TabsTrigger>
                            <TabsTrigger value="image">
                                <Image className="h-4 w-4 mr-2" />
                                Image
                            </TabsTrigger>
                            <TabsTrigger value="video">
                                <FileVideo className="h-4 w-4 mr-2" />
                                Video
                            </TabsTrigger>
                            <TabsTrigger value="custom">
                                <Code className="h-4 w-4 mr-2" />
                                Custom
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="youtube" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="youtube-url">YouTube URL</Label>
                                <Input
                                    id="youtube-url"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleYouTubeEmbed} className="w-full">
                                Embed YouTube Video
                            </Button>
                        </TabsContent>

                        <TabsContent value="image" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image-url">Image URL</Label>
                                <Input
                                    id="image-url"
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleImageEmbed} className="w-full">
                                Embed Image
                            </Button>
                        </TabsContent>

                        <TabsContent value="video" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="video-url">Video URL</Label>
                                <Input
                                    id="video-url"
                                    placeholder="https://example.com/video.mp4"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleVideoEmbed} className="w-full">
                                Embed Video
                            </Button>
                        </TabsContent>

                        <TabsContent value="custom" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="embed-code">Embed Code</Label>
                                <textarea
                                    id="embed-code"
                                    className="w-full min-h-[100px] p-3 border rounded-md"
                                    placeholder="Paste your embed code here..."
                                    value={embedCode}
                                    onChange={(e) => setEmbedCode(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleCustomEmbed} className="w-full">
                                Embed Custom Code
                            </Button>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
}
