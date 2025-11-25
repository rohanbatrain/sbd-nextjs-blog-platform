import { Suspense } from "react";
import CreatePostClient from "./client";

export const dynamic = "force-dynamic";

export default function CreatePostPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreatePostClient />
        </Suspense>
    );
}
