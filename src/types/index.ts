export interface BlogWebsite {
    website_id: string;
    name: string;
    subdomain: string;
    custom_domain?: string;
    description?: string;
    logo_url?: string;
    theme?: string;
    owner_id: string;
    created_at: string;
}

export interface BlogPost {
    post_id: string;
    website_id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    author_id: string;
    status: 'draft' | 'published' | 'archived';
    published_at?: string;
    created_at: string;
    updated_at: string;
    view_count: number;
    categories: string[];
    tags: string[];
}

export interface BlogCategory {
    category_id: string;
    website_id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface BlogComment {
    comment_id: string;
    post_id: string;
    author_name: string;
    author_email: string;
    content: string;
    status: 'pending' | 'approved' | 'spam';
    created_at: string;
}
