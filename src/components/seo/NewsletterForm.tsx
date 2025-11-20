"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Check } from "lucide-react";

interface NewsletterFormProps {
    websiteId: string;
    apiUrl: string;
}

export function NewsletterForm({ websiteId, apiUrl }: NewsletterFormProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${apiUrl}/blog/websites/${websiteId}/newsletter/subscribe`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (response.ok) {
                setSuccess(true);
                setEmail("");
            } else {
                const data = await response.json();
                setError(data.detail || "Failed to subscribe");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100">
                            Successfully subscribed!
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                            Check your email for confirmation.
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg">Subscribe to our newsletter</h3>
                        <p className="text-sm text-muted-foreground">
                            Get the latest posts delivered right to your inbox.
                        </p>
                    </div>

                    <form onSubmit={handleSubscribe} className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1"
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? "Subscribing..." : "Subscribe"}
                            </Button>
                        </div>

                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                    </form>
                </div>
            </div>
        </Card>
    );
}
