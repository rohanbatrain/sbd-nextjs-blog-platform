"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Eye, Heart, Share2, Bookmark } from "lucide-react";

interface EngagementData {
    views: number;
    unique_views: number;
    likes: number;
    shares: number;
    bookmarks: number;
    comments: number;
}

interface EngagementChartProps {
    postId: string;
    websiteId: string;
    apiUrl: string;
}

export function EngagementChart({ postId, websiteId, apiUrl }: EngagementChartProps) {
    const [data, setData] = useState<EngagementData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEngagementData();
    }, [postId]);

    const loadEngagementData = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/blog/websites/${websiteId}/posts/${postId}/engagement`
            );

            if (response.ok) {
                const engagementData = await response.json();
                setData(engagementData);
            }
        } catch (error) {
            console.error("Failed to load engagement data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-[200px] bg-muted rounded"></div>
                </div>
            </Card>
        );
    }

    if (!data) return null;

    const metrics = [
        { label: "Views", value: data.views, icon: Eye, color: "text-blue-500" },
        { label: "Likes", value: data.likes, icon: Heart, color: "text-red-500" },
        { label: "Shares", value: data.shares, icon: Share2, color: "text-green-500" },
        { label: "Bookmarks", value: data.bookmarks, icon: Bookmark, color: "text-purple-500" },
    ];

    return (
        <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Engagement Metrics</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <div key={metric.label} className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon className={`h-4 w-4 ${metric.color}`} />
                                {metric.label}
                            </div>
                            <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
                        </div>
                    );
                })}
            </div>

            <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                    Unique Views: <span className="font-semibold">{data.unique_views.toLocaleString()}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                    Comments: <span className="font-semibold">{data.comments.toLocaleString()}</span>
                </p>
            </div>
        </Card>
    );
}
