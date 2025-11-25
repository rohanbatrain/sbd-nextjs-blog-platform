import { Suspense } from 'react';
import ScheduledClient from './client';

export const dynamic = 'force-dynamic';

export default function ScheduledPage() {
    return (
        <Suspense fallback={<div className="p-4">Loading scheduled posts...</div>}>
            <ScheduledClient />
        </Suspense>
    );
}
