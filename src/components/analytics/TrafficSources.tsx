"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Globe } from "lucide-react";

interface TrafficSource {
    source: string;
    visits: number;
    percentage: number;
}

interface TrafficSourcesProps {
    websiteId: string;
    apiUrl: string;
}

export function TrafficSources({ websiteId, apiUrl }: TrafficSourcesProps) {
    const [sources, setSources] = useState<TrafficSource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now - in production, fetch from analytics
        const mockData: TrafficSource[] = [
            { source: "Direct", visits: 1250, percentage: 35 },
            { source: "Google", visits: 980, percentage: 28 },
            { source: "Social Media", visits: 720, percentage: 20 },
            { source: "Referral", visits: 420, percentage: 12 },
            { source: "Email", visits: 180, percentage: 5 },
        ];

        setSources(mockData);
        setLoading(false);
    }, [websiteId]);

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-[250px] bg-muted rounded"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Traffic Sources</h3>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sources}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            <div className="space-y-3">
                {sources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-full max-w-[200px] bg-muted rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${source.percentage}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium min-w-[100px]">{source.source}</span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold">{source.visits.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{source.percentage}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
