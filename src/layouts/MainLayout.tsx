import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
