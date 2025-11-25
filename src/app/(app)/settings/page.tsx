import { Suspense } from "react";
import SettingsClient from "./client";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SettingsClient />
        </Suspense>
    );
}
