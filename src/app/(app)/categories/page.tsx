import { Suspense } from "react";
import CategoriesClient from "./client";

export const dynamic = "force-dynamic";

export default function CategoriesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CategoriesClient />
        </Suspense>
    );
}
