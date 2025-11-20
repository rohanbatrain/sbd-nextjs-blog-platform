import Link from 'next/link';
import { BlogPost } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
    post: BlogPost;
    websiteId: string;
}

export function PostCard({ post, websiteId }: PostCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow group">
            {post.featured_image && (
                <div className="h-48 w-full overflow-hidden rounded-t-xl">
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <CardHeader className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.slice(0, 2).map(cat => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                        </Badge>
                    ))}
                    {post.status === 'draft' && (
                        <Badge variant="outline" className="text-xs">Draft</Badge>
                    )}
                </div>
                <Link href={`/blog/${websiteId}/${post.slug}`}>
                    <h3 className="text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                </Link>
                {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                        {post.excerpt}
                    </p>
                )}
            </CardHeader>

            <CardFooter className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">AU</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium">Author</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.view_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>5 min</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
