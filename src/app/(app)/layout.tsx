import { Sidebar } from "@/components/layout/Sidebar";
import { WebsiteProvider } from '@/context/WebsiteContext';
import { TenantSwitchLoader } from "@/components/layout/TenantSwitchLoader";
import { WebsiteBreadcrumb } from "@/components/layout/WebsiteBreadcrumb";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WebsiteProvider>
            <ErrorBoundary>
                <TenantSwitchLoader />
                <div className="min-h-screen">
                    <Sidebar appName="BlogHub">
                        <WebsiteBreadcrumb />
                        {children}
                    </Sidebar>
                </div>
            </ErrorBoundary>
        </WebsiteProvider>
    );
}
