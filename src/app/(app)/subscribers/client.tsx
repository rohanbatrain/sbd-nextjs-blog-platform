"use client";

import { useEffect, useState } from "react";
import { useCurrentWebsite } from "@/hooks/useCurrentWebsite";
import Link from "next/link";
import { blogApi } from "@/lib/api";
import { BlogWebsite, NewsletterSubscriber } from "@/types/blog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function SubscribersClient() {
    const website = useCurrentWebsite();

    const [loading, setLoading] = useState(true);
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

    useEffect(() => {
        if (!website) {
            // No website selected yet; show placeholder UI
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                const subscribersData = await blogApi.getSubscribers(website.website_id);
                setSubscribers(subscribersData);
            } catch (error) {
                console.error("Failed to fetch subscribers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [website?.website_id]);

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
                    <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
                    <p className="text-muted-foreground">
                        Manage newsletter subscribers for {website.name}
                    </p>
                </div>
                <Button className="gap-2">
                    <Mail className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Subscribed</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscribers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No subscribers yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            subscribers.map((sub) => (
                                <TableRow key={sub.subscriber_id}>
                                    <TableCell className="font-medium">{sub.email}</TableCell>
                                    <TableCell>{sub.name || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant={sub.is_active ? "default" : "secondary"}>
                                            {sub.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(sub.subscribed_at), { addSuffix: true })}
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
