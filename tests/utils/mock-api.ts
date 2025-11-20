/**
 * Mock API responses for testing
 */
export const mockApiResponse = <T,>(data: T, delay = 0): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), delay);
    });
};

/**
 * Mock API error for testing error handling
 */
export const mockApiError = (message: string, status = 500, delay = 0): Promise<never> => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject({
                response: {
                    status,
                    data: { message },
                },
            });
        }, delay);
    });
};

/**
 * Create a mock fetch response
 */
export const createMockResponse = <T,>(data: T, status = 200) => {
    return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: async () => data,
        text: async () => JSON.stringify(data),
    } as Response);
};
