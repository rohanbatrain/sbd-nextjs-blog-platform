import { renderHook, waitFor, act } from '@testing-library/react';
import { useWebsite } from '@/context/WebsiteContext';
import { WebsiteProvider } from '@/context/WebsiteContext';
import { blogApi } from '@/lib/api';

// Mock dependencies
jest.mock('@/lib/api');
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        replace: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn(() => null),
    }),
}));

const mockWebsites = [
    {
        website_id: 'website-1',
        name: 'Test Blog 1',
        slug: 'test-blog-1',
        description: 'First test blog',
        owner_id: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        website_id: 'website-2',
        name: 'Test Blog 2',
        slug: 'test-blog-2',
        description: 'Second test blog',
        owner_id: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

describe('useWebsite Hook', () => {
    beforeEach(() => {
        // Clear mocks
        jest.clearAllMocks();
        // Clear localStorage and cookies
        localStorage.clear();
        document.cookie = '';
        // Mock API
        (blogApi.getWebsites as jest.Mock).mockResolvedValue(mockWebsites);
    });

    it('should load websites on mount', async () => {
        const { result } = renderHook(() => useWebsite(), {
            wrapper: WebsiteProvider,
        });

        await waitFor(() => {
            expect(result.current.websites).toHaveLength(2);
        });

        expect(result.current.websites).toEqual(mockWebsites);
    });

    it('should set first website as default when no preference exists', async () => {
        const { result } = renderHook(() => useWebsite(), {
            wrapper: WebsiteProvider,
        });

        await waitFor(() => {
            expect(result.current.websiteId).toBe('website-1');
        });
    });

    it('should restore websiteId from localStorage', async () => {
        localStorage.setItem('sbd-blog-website-id', 'website-2');

        const { result } = renderHook(() => useWebsite(), {
            wrapper: WebsiteProvider,
        });

        await waitFor(() => {
            expect(result.current.websiteId).toBe('website-2');
        });
    });

    it('should fallback to cookie if localStorage is empty', async () => {
        document.cookie = 'sbd-blog-website-id=website-2';

        const { result } = renderHook(() => useWebsite(), {
            wrapper: WebsiteProvider,
        });

        await waitFor(() => {
            expect(result.current.websiteId).toBe('website-2');
        });
    });

    it('should persist websiteId to both localStorage and cookie when changed', async () => {
        const { result } = renderHook(() => useWebsite(), {
            wrapper: WebsiteProvider,
        });

        await waitFor(() => {
            expect(result.current.websites).toHaveLength(2);
        });

        // Change website
        act(() => {
            result.current.setWebsiteId('website-2');
        });

        await waitFor(() => {
            expect(localStorage.getItem('sbd-blog-website-id')).toBe('website-2');
            expect(document.cookie).toContain('sbd-blog-website-id=website-2');
        });
    });

    it('should set loading state during website change', async () => {
        const { result } = renderHook(() => useWebsite(), {
            wrapper: WebsiteProvider,
        });

        await waitFor(() => {
            expect(result.current.websites).toHaveLength(2);
        });

        // Change website
        act(() => {
            result.current.setWebsiteId('website-2');
        });

        // Should be loading immediately
        expect(result.current.isLoading).toBe(true);

        // Should clear after timeout
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        }, { timeout: 1000 });
    });

    it('should validate websiteId exists in user websites', async () => {
        localStorage.setItem('sbd-blog-website-id', 'invalid-website-id');

        const { result } = renderHook(() => useWebsite(), {
            wrapper: WebsiteProvider,
        });

        await waitFor(() => {
            // Should fallback to first website if stored ID is invalid
            expect(result.current.websiteId).toBe('website-1');
        });
    });

    it('should handle API errors gracefully', async () => {
        (blogApi.getWebsites as jest.Mock).mockRejectedValue(new Error('API Error'));

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const { result } = renderHook(() => useWebsite(), {
            wrapper: WebsiteProvider,
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to load websites', expect.any(Error));
        });

        expect(result.current.websites).toEqual([]);
        expect(result.current.websiteId).toBeNull();

        consoleSpy.mockRestore();
    });
});
