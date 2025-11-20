import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
    },
    websites: {
        list: '/blog/websites',
        detail: (id: string) => `/blog/websites/${id}`,
        create: '/blog/websites',
        update: (id: string) => `/blog/websites/${id}`,
        analytics: (id: string) => `/blog/websites/${id}/analytics`,
    },
    posts: {
        list: (websiteId: string) => `/blog/websites/${websiteId}/posts`,
        // Note: Backend GET uses post_slug, PUT/DELETE use post_id
        // For detail view, use slug; for updates/deletes, use id
        detail: (websiteId: string, postSlug: string) => `/blog/websites/${websiteId}/posts/${postSlug}`,
        create: (websiteId: string) => `/blog/websites/${websiteId}/posts`,
        update: (websiteId: string, postId: string) => `/blog/websites/${websiteId}/posts/${postId}`,
        delete: (websiteId: string, postId: string) => `/blog/websites/${websiteId}/posts/${postId}`,
    },
    categories: {
        list: (websiteId: string) => `/blog/websites/${websiteId}/categories`,
        create: (websiteId: string) => `/blog/websites/${websiteId}/categories`,
    },
    comments: {
        list: (websiteId: string, postId: string) => `/blog/websites/${websiteId}/posts/${postId}/comments`,
        create: (websiteId: string, postId: string) => `/blog/websites/${websiteId}/posts/${postId}/comments`,
        update: (websiteId: string, postId: string, commentId: string) => `/blog/websites/${websiteId}/posts/${postId}/comments/${commentId}`,
    },
};
