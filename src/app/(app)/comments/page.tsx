import { Suspense } from "react";
import CommentsClient from "./client";

export const dynamic = "force-dynamic";

export default function CommentsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CommentsClient />
        </Suspense>
    );
}
