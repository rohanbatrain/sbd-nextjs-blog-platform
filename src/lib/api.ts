import axios, { AxiosError } from 'axios';
import { BlogWebsite, BlogPost, BlogComment, BlogAnalytics, NewsletterSubscriber, BlogCategory } from '@/types/blog';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to inject token if available
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle 403 tenant mismatch errors
        if (error.response?.status === 403) {
            const message = (error.response.data as any)?.detail || 'Access denied';

            if (message.includes('website') || message.includes('tenant')) {
                toast.error('Website Access Error', {
                    description: message,
                    action: {
                        label: 'Switch Website',
                        onClick: () => {
                            // Redirect to dashboard to select correct website
                            window.location.href = '/dashboard';
                        },
                    },
                });
            } else {
                toast.error('Access Denied', {
                    description: message,
                });
            }
        }

        // Handle other errors
        else if (error.response?.status === 401) {
            toast.error('Authentication Required', {
                description: 'Please log in to continue',
                action: {
                    label: 'Login',
                    onClick: () => {
                        window.location.href = '/login';
                    },
                },
            });
        }

        // Handle network errors
        else if (!error.response) {
            toast.error('Network Error', {
                description: 'Unable to connect to the server',
            });
        }

        return Promise.reject(error);
    }
);

export const blogApi = {
    // Websites
    getWebsites: async () => {
        const response = await api.get<BlogWebsite[]>('/blog/websites');
        return response.data;
    },
    getWebsite: async (websiteId: string) => {
        const response = await api.get<BlogWebsite>(`/blog/websites/${websiteId}`);
        return response.data;
    },
    updateWebsite: async (websiteId: string, data: Partial<BlogWebsite>) => {
        const response = await api.put<BlogWebsite>(`/blog/websites/${websiteId}`, data);
        return response.data;
    },
    createWebsite: async (data: Partial<BlogWebsite>) => {
        const response = await api.post<BlogWebsite>('/blog/websites', data);
        return response.data;
    },
    createCategory: async (websiteId: string, data: any) => {
        const response = await api.post(`/blog/websites/${websiteId}/categories`, data);
        return response.data;
    },
    getCategories: async (websiteId: string) => {
        const response = await api.get(`/blog/websites/${websiteId}/categories`);
        return response.data;
    },
    updateCategory: async (websiteId: string, categoryId: string, data: any) => {
        const response = await api.put(`/blog/websites/${websiteId}/categories/${categoryId}`, data);
        return response.data;
    },
    deleteCategory: async (websiteId: string, categoryId: string) => {
        await api.delete(`/blog/websites/${websiteId}/categories/${categoryId}`);
    },

    // Posts
    getPosts: async (websiteId: string, params?: { page?: number; limit?: number; status?: string; category?: string }) => {
        const response = await api.get<BlogPost[]>(`/blog/websites/${websiteId}/posts`, { params });
        return response.data;
    },
    getPost: async (websiteId: string, slug: string) => {
        const response = await api.get<BlogPost>(`/blog/websites/${websiteId}/posts/${slug}`);
        return response.data;
    },
    createPost: async (websiteId: string, data: Partial<BlogPost>) => {
        const response = await api.post<BlogPost>(`/blog/websites/${websiteId}/posts`, data);
        return response.data;
    },
    updatePost: async (websiteId: string, postId: string, data: Partial<BlogPost>) => {
        const response = await api.put<BlogPost>(`/blog/websites/${websiteId}/posts/${postId}`, data);
        return response.data;
    },
    deletePost: async (websiteId: string, postId: string) => {
        await api.delete(`/blog/websites/${websiteId}/posts/${postId}`);
    },
    autosavePost: async (websiteId: string, postId: string, content: string, title?: string) => {
        const response = await api.post(`/blog/websites/${websiteId}/posts/${postId}/autosave`, { content, title });
        return response.data;
    },

    // Comments
    getComments: async (websiteId: string, postId: string, status?: string) => {
        const response = await api.get<BlogComment[]>(`/blog/websites/${websiteId}/posts/${postId}/comments`, { params: { status } });
        return response.data;
    },
    getAllComments: async (websiteId: string, params?: { page?: number; limit?: number; status?: string }) => {
        const response = await api.get<BlogComment[]>(`/blog/websites/${websiteId}/comments`, { params });
        return response.data;
    },
    createComment: async (websiteId: string, postId: string, data: Partial<BlogComment>) => {
        const response = await api.post<BlogComment>(`/blog/websites/${websiteId}/posts/${postId}/comments`, data);
        return response.data;
    },

    // Analytics
    getAnalytics: async (websiteId: string, days: number = 30) => {
        const response = await api.get<BlogAnalytics>(`/blog/websites/${websiteId}/analytics`, { params: { days } });
        return response.data;
    },

    // Subscribers
    getSubscribers: async (websiteId: string) => {
        const response = await api.get<NewsletterSubscriber[]>(`/blog/websites/${websiteId}/subscribers`);
        return response.data;
    },

    // Search
    searchPosts: async (websiteId: string, query: string, page: number = 1, limit: number = 10) => {
        const response = await api.get(`/blog/websites/${websiteId}/search`, { params: { q: query, page, limit } });
        return response.data;
    }
};
