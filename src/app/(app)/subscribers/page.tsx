import { Suspense } from "react";
import SubscribersClient from "./client";

export const dynamic = "force-dynamic";

export default function SubscribersPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubscribersClient />
        </Suspense>
    );
}
