export interface BlogWebsite {
    website_id: string;
    name: string;
    slug: string;
    description?: string;
    owner_id: string;
    is_active: boolean;
    is_public: boolean;
    allow_comments: boolean;
    require_comment_approval: boolean;
    allow_guest_comments: boolean;
    seo_title?: string;
    seo_description?: string;
    google_analytics_id?: string;
    post_count: number;
    total_views: number;
    monthly_views: number;
    created_at: string;
    updated_at: string;
    last_post_at?: string;
    user_role?: string;
}

export interface BlogPost {
    post_id: string;
    website_id: string;
    title: string;
    slug: string;
    excerpt: string;
    featured_image?: string;
    author_id: string;
    author_name: string;
    status: 'draft' | 'published' | 'scheduled' | 'archived';
    published_at?: string;
    updated_at: string;
    categories: any[]; // Define Category interface if needed
    tags: string[];
    seo_title?: string;
    seo_description?: string;
    seo_keywords: string[];
    social_image?: string;
    reading_time: number;
    word_count: number;
    view_count: number;
    like_count: number;
    comment_count: number;
    is_featured: boolean;
    is_pinned: boolean;
    scheduled_publish_at?: string;
    content?: string; // Content might not be in list view
}

export interface BlogComment {
    comment_id: string;
    website_id: string;
    post_id: string;
    author_id?: string;
    author_name: string;
    author_email: string;
    content: string;
    parent_id?: string;
    status: 'pending' | 'approved' | 'rejected' | 'spam';
    is_approved: boolean;
    likes: number;
    created_at: string;
    updated_at: string;
    replies: BlogComment[];
}

export interface BlogAnalytics {
    total_posts: number;
    total_views: number;
    total_comments: number;
    total_likes: number;
    posts_by_status: Record<string, number>;
    views_by_period: any[];
    top_posts: any[];
    popular_categories: any[];
    popular_tags: string[];
}

export interface NewsletterSubscriber {
    subscriber_id: string;
    website_id: string;
    email: string;
    name?: string;
    is_active: boolean;
    subscribed_at: string;
}

export interface BlogCategory {
    category_id: string;
    website_id: string;
    name: string;
    slug: string;
    description?: string;
    post_count: number;
    created_at: string;
    updated_at: string;
}
