/**
 * Test fixtures for Digital Shop
 */

export const mockItem = {
    id: '1',
    name: 'Premium Theme',
    description: 'A beautiful premium theme for your website',
    price: 29.99,
    category: 'themes',
    image: '/placeholder.jpg',
    rating: 4.5,
    reviews: 120,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
};

export const mockCategory = {
    id: '1',
    name: 'Themes',
    slug: 'themes',
    description: 'Website themes and templates',
    itemCount: 50,
};

export const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    name: 'Test User',
};

export const mockPurchase = {
    id: '1',
    userId: '1',
    itemId: '1',
    price: 29.99,
    purchasedAt: '2024-01-01T00:00:00Z',
};

export const mockItems = Array.from({ length: 10 }, (_, i) => ({
    ...mockItem,
    id: String(i + 1),
    name: `Item ${i + 1}`,
    price: 10 + i * 5,
}));

export const mockCategories = Array.from({ length: 5 }, (_, i) => ({
    ...mockCategory,
    id: String(i + 1),
    name: `Category ${i + 1}`,
    slug: `category-${i + 1}`,
}));
