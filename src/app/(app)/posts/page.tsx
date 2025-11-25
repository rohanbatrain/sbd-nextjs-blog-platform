import { Suspense } from "react";
import PostsClient from "./client";

export const dynamic = "force-dynamic";

export default function PostsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostsClient />
        </Suspense>
    );
}
