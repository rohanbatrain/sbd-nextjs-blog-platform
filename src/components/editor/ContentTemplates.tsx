"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FileText, Layout, Newspaper, BookOpen } from "lucide-react";

interface Template {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    content: string;
    excerpt: string;
}

const templates: Template[] = [
    {
        id: "blog-post",
        name: "Blog Post",
        description: "Standard blog post with introduction, body, and conclusion",
        icon: <FileText className="h-6 w-6" />,
        content: `# Blog Post Title

## Introduction
Start with a compelling introduction that hooks your readers...

## Main Points
### Point 1
Explain your first main point...

### Point 2
Discuss your second main point...

### Point 3
Elaborate on your third main point...

## Conclusion
Wrap up with a strong conclusion that reinforces your message...`,
        excerpt: "A well-structured blog post template",
    },
    {
        id: "how-to-guide",
        name: "How-To Guide",
        description: "Step-by-step tutorial format",
        icon: <Layout className="h-6 w-6" />,
        content: `# How To: [Task Name]

## What You'll Need
- Item 1
- Item 2
- Item 3

## Step 1: [First Step]
Explain the first step in detail...

## Step 2: [Second Step]
Explain the second step in detail...

## Step 3: [Third Step]
Explain the third step in detail...

## Troubleshooting
Common issues and solutions...

## Conclusion
Summary and next steps...`,
        excerpt: "A comprehensive how-to guide template",
    },
    {
        id: "news-article",
        name: "News Article",
        description: "Journalistic news article format",
        icon: <Newspaper className="h-6 w-6" />,
        content: `# Headline: [News Headline]

**[City, Date]** - Lead paragraph summarizing the who, what, when, where, and why...

## Background
Provide context and background information...

## Key Details
Important facts and quotes from sources...

## Impact
Discuss the implications and impact...

## What's Next
Future developments and next steps...`,
        excerpt: "Professional news article template",
    },
    {
        id: "product-review",
        name: "Product Review",
        description: "Detailed product review structure",
        icon: <BookOpen className="h-6 w-6" />,
        content: `# Product Review: [Product Name]

## Overview
Brief overview of the product and who it's for...

## Design & Build Quality
Discuss the product's design and build...

## Features
### Feature 1
Detailed look at this feature...

### Feature 2
Detailed look at this feature...

## Performance
How well does it perform in real-world use?

## Pros & Cons
**Pros:**
- Pro 1
- Pro 2
- Pro 3

**Cons:**
- Con 1
- Con 2

## Final Verdict
Overall rating and recommendation...`,
        excerpt: "Comprehensive product review template",
    },
];

interface ContentTemplatesProps {
    onSelect: (template: Template) => void;
}

export function ContentTemplates({ onSelect }: ContentTemplatesProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (template: Template) => {
        onSelect(template);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Templates
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Content Templates</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                        <Card
                            key={template.id}
                            className="p-6 cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => handleSelect(template)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    {template.icon}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h3 className="font-semibold">{template.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {template.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
