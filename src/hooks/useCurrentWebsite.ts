import { useWebsite } from '@/context/WebsiteContext';
import { BlogWebsite } from '@/types/blog';

/**
 * Returns the currently selected website (tenant) based on the shared WebsiteContext.
 * If no website is selected, returns null.
 */
export const useCurrentWebsite = (): BlogWebsite | null => {
    const { websiteId, websites } = useWebsite();
    return websites.find((w) => w.website_id === websiteId) ?? null;
};
