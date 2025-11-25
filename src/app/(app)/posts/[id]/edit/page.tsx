import { Suspense } from "react";
import EditPostClient from "./client";

export const dynamic = "force-dynamic";

export default function EditPostPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditPostClient />
        </Suspense>
    );
}
