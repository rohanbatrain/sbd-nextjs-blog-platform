"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebsite } from "@/context/WebsiteContext";
import { useState, useMemo } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface SidebarProps {
    appName: string;
}

export function Sidebar({ appName, children }: SidebarProps & { children: React.ReactNode }) {
    const pathname = usePathname();
    const { websiteId, setWebsiteId, websites } = useWebsite();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigation = useMemo(() => {
        const query = websiteId ? `?websiteId=${websiteId}` : "";
        return [
            { name: "Dashboard", href: `/dashboard${query}`, icon: LayoutDashboard },
            { name: "Posts", href: `/posts${query}`, icon: FileText },
            { name: "Comments", href: `/comments${query}`, icon: MessageSquare },
            { name: "Categories", href: `/categories${query}`, icon: FolderOpen },
            { name: "Scheduled", href: `/scheduled${query}`, icon: Calendar },
            { name: "Subscribers", href: `/subscribers${query}`, icon: Users },
            { name: "Settings", href: `/settings${query}`, icon: Settings },
        ];
    }, [websiteId]);

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen bg-background border-r transition-all duration-300",
                    collapsed ? "w-16" : "w-64",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex h-16 items-center justify-between border-b px-4">
                        {/* Website selector */}
                        <Select value={websiteId ?? ""} onValueChange={setWebsiteId}>
                            <SelectTrigger className="w-[180px]" data-testid="website-selector">
                                <SelectValue placeholder="Select website" />
                            </SelectTrigger>
                            <SelectContent>
                                {websites.map((w, index) => (
                                    <SelectItem
                                        key={w.website_id}
                                        value={w.website_id}
                                        data-testid={`website-option-${index}`}
                                    >
                                        {w.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* App title when not collapsed */}
                        {!collapsed && (
                            <Link href="/dashboard" className="flex items-center gap-2 truncate">
                                <span className="text-xl font-bold truncate" title={appName}>{appName}</span>
                            </Link>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("hidden lg:flex", collapsed && "mx-auto")}
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
                        {navigation.map((item) => {
                            // Check if the current path starts with the item's href (ignoring query params for active state)
                            // Actually, simple exact match or prefix match is better.
                            // item.href includes query params, so we should compare pathname with item.href without query.
                            const itemPath = item.href.split('?')[0];
                            const isActive = pathname === itemPath || (itemPath !== '/dashboard' && pathname.startsWith(itemPath));

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!collapsed && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="border-t p-2">
                        <Link
                            href="/my-websites"
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            )}
                            title={collapsed ? "Switch Website" : undefined}
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>Switch Website</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <main
                className={cn(
                    "min-h-screen transition-all duration-300",
                    collapsed ? "lg:ml-16" : "lg:ml-64"
                )}
            >
                {children}
            </main>
        </>
    );
}
