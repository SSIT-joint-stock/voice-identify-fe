import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="flex items-center p-4 border-b">
          <SidebarTrigger />
          <h1 className="ml-4 text-lg font-semibold italic">Voice Identify</h1>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
