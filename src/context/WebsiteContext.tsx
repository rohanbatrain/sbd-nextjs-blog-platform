import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { blogApi } from '@/lib/api';
import { BlogWebsite } from '@/types/blog';

type WebsiteContextProps = {
    websiteId: string | null;
    setWebsiteId: (id: string) => void;
    websites: BlogWebsite[];
    isLoading: boolean;
};

const WebsiteContext = createContext<WebsiteContextProps | undefined>(undefined);

export const WebsiteProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialId = searchParams?.get('websiteId') ?? null;
    const [websiteId, setWebsiteId] = useState<string | null>(initialId);
    const [websites, setWebsites] = useState<BlogWebsite[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load user's websites once
    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await blogApi.getWebsites();
                setWebsites(data);

                // Priority: URL param > localStorage > Cookie > First website
                let selectedId = initialId;

                if (!selectedId && typeof window !== 'undefined') {
                    // Try localStorage first
                    selectedId = localStorage.getItem('sbd-blog-website-id') || null;

                    // Fallback to cookie if localStorage is empty
                    if (!selectedId) {
                        const cookieMatch = document.cookie.match(/sbd-blog-website-id=([^;]+)/);
                        selectedId = cookieMatch ? cookieMatch[1] : null;
                    }
                }

                // If still no ID, default to first website
                if (!selectedId && data.length) {
                    selectedId = data[0].website_id;
                }

                // Validate the selected ID exists in user's websites
                const websiteExists = data.some(w => w.website_id === selectedId);
                if (selectedId && websiteExists) {
                    changeWebsite(selectedId);
                } else if (data.length) {
                    changeWebsite(data[0].website_id);
                }
            } catch (e) {
                console.error('Failed to load websites', e);
            }
        };
        fetch();
    }, []);

    const changeWebsite = (id: string) => {
        setIsLoading(true);
        setWebsiteId(id);

        // Persist to both localStorage and cookie for maximum compatibility
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('sbd-blog-website-id', id);
            } catch (e) {
                console.warn('localStorage not available, falling back to cookies only', e);
            }
        }

        // Persist selection in cookie for middleware/server
        document.cookie = `sbd-blog-website-id=${id}; path=/; max-age=31536000; SameSite=Lax`;

        // keep query param in sync – triggers server re‑render
        router.replace(`?websiteId=${id}`);

        // Loading will be cleared by individual pages after data fetch
        setTimeout(() => setIsLoading(false), 500);
    };

    return (
        <WebsiteContext.Provider value={{ websiteId, setWebsiteId: changeWebsite, websites, isLoading }}>
            {children}
        </WebsiteContext.Provider>
    );
};

export const useWebsite = () => {
    const ctx = useContext(WebsiteContext);
    if (!ctx) throw new Error('useWebsite must be used within WebsiteProvider');
    return ctx;
};
