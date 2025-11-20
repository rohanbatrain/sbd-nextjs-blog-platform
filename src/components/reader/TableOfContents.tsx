"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { ChevronRight } from "lucide-react";

interface ToCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [items, setItems] = useState<ToCItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Parse headings from content
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        const tocItems: ToCItem[] = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text.toLowerCase().replace(/[^\w]+/g, "-");

            tocItems.push({ id, text, level });
        }

        setItems(tocItems);

        // Set up intersection observer for active heading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -80% 0px" }
        );

        // Observe all headings
        tocItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [content]);

    if (items.length === 0) return null;

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <Card className="p-4 sticky top-4">
            <h3 className="font-semibold mb-4">Table of Contents</h3>
            <nav className="space-y-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={`flex items-start gap-2 text-sm w-full text-left hover:text-primary transition-colors ${activeId === item.id ? "text-primary font-medium" : "text-muted-foreground"
                            }`}
                        style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                    >
                        <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{item.text}</span>
                    </button>
                ))}
            </nav>
        </Card>
    );
}
