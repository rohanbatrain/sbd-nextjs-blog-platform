import { renderHook } from '@testing-library/react';
import { useCurrentWebsite } from '@/hooks/useCurrentWebsite';
import { useWebsite } from '@/context/WebsiteContext';

// Mock the useWebsite hook
jest.mock('@/context/WebsiteContext');

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

describe('useCurrentWebsite Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the current website when websiteId matches', () => {
        (useWebsite as jest.Mock).mockReturnValue({
            websiteId: 'website-1',
            websites: mockWebsites,
            setWebsiteId: jest.fn(),
            isLoading: false,
        });

        const { result } = renderHook(() => useCurrentWebsite());

        expect(result.current).toEqual(mockWebsites[0]);
    });

    it('should return null when no websiteId is set', () => {
        (useWebsite as jest.Mock).mockReturnValue({
            websiteId: null,
            websites: mockWebsites,
            setWebsiteId: jest.fn(),
            isLoading: false,
        });

        const { result } = renderHook(() => useCurrentWebsite());

        expect(result.current).toBeNull();
    });

    it('should return null when websiteId does not match any website', () => {
        (useWebsite as jest.Mock).mockReturnValue({
            websiteId: 'non-existent-id',
            websites: mockWebsites,
            setWebsiteId: jest.fn(),
            isLoading: false,
        });

        const { result } = renderHook(() => useCurrentWebsite());

        expect(result.current).toBeNull();
    });

    it('should return null when websites array is empty', () => {
        (useWebsite as jest.Mock).mockReturnValue({
            websiteId: 'website-1',
            websites: [],
            setWebsiteId: jest.fn(),
            isLoading: false,
        });

        const { result } = renderHook(() => useCurrentWebsite());

        expect(result.current).toBeNull();
    });

    it('should update when websiteId changes', () => {
        const { result, rerender } = renderHook(() => useCurrentWebsite());

        // Initially website-1
        (useWebsite as jest.Mock).mockReturnValue({
            websiteId: 'website-1',
            websites: mockWebsites,
            setWebsiteId: jest.fn(),
            isLoading: false,
        });

        rerender();
        expect(result.current).toEqual(mockWebsites[0]);

        // Change to website-2
        (useWebsite as jest.Mock).mockReturnValue({
            websiteId: 'website-2',
            websites: mockWebsites,
            setWebsiteId: jest.fn(),
            isLoading: false,
        });

        rerender();
        expect(result.current).toEqual(mockWebsites[1]);
    });
});
