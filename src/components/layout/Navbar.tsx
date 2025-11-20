import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, User } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <BookOpen className="h-6 w-6" />
                        <span>BlogHub</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <Link href="/explore" className="hover:text-foreground transition-colors">
                            Explore
                        </Link>
                        <Link href="/pricing" className="hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                        <Link href="/about" className="hover:text-foreground transition-colors">
                            About
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Search className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                        <Link href="/create">
                            <Button size="sm">Create Blog</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
