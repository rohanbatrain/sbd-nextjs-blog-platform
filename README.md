# sbd-nextjs-blog-platform

The **Blog Platform** is a feature-rich blogging application built with Next.js, designed for creating, managing, and publishing content within the Second Brain ecosystem.

## Features

-   **Rich Text Editor**: Powerful editing experience powered by [Tiptap](https://tiptap.dev/).
-   **Markdown Support**: Render markdown content with `react-markdown`.
-   **Content Management**: Create, edit, and delete blog posts.
-   **Analytics**: Visualize post performance with `recharts`.
-   **SEO Optimized**: Built with Next.js for optimal search engine performance.

## Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Editor**: Tiptap
-   **Forms**: React Hook Form + Zod
-   **UI Components**: Radix UI, Lucide React
-   **Testing**: Jest, Playwright

## Prerequisites

-   Node.js 20+
-   pnpm (recommended) or npm/yarn

## Getting Started

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```

2.  **Set up environment variables**:
    Copy `.env.example` to `.env.local` and configure the necessary variables.
    ```bash
    cp .env.example .env.local
    ```

3.  **Run the development server**:
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

-   `pnpm dev`: Run the development server.
-   `pnpm build`: Build the application for production.
-   `pnpm start`: Start the production server.
-   `pnpm lint`: Run ESLint.
-   `pnpm test`: Run unit tests with Jest.
-   `pnpm test:e2e`: Run end-to-end tests with Playwright.
-   `pnpm storybook`: Start Storybook for component development.

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `components/`: Reusable UI components.
-   `lib/`: Utility functions and shared logic.
-   `store/`: Zustand state management stores.
-   `hooks/`: Custom React hooks.

## License

Private
