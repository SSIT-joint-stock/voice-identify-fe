import * as React from 'react';
import { useState } from 'react';
import { BookOpenText, Home, KeyRound, LogOut, Mic, Search, UsersRound } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar-context';
import { ROUTES } from '@/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth.store';
import { logoutApi } from '@/api/auth.api';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';

const navigation = [
  { title: 'Trang chủ', url: ROUTES.HOME, icon: Home },
  { title: 'Đăng ký giọng nói', url: ROUTES.VOICE_ENROLL, icon: Mic },
  { title: 'Tra cứu 1 người', url: ROUTES.VOICE_SEARCH_SINGLE, icon: Search },
  {
    title: 'Tra cứu 1-2 người',
    url: ROUTES.VOICE_SEARCH_MULTI,
    icon: UsersRound,
  },
  {
    title: 'Hướng dẫn sử dụng',
    url: ROUTES.VOICE_GUIDE,
    icon: BookOpenText,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutApi();
    } catch {
      // Logout even if API fails
    } finally {
      clearAuth();
      setLoggingOut(false);
      toast.success('Đã đăng xuất');
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent className="bg-white">
          <SidebarMenu className="gap-2 px-3 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.url ||
                (item.url !== ROUTES.HOME && location.pathname.startsWith(item.url));

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className="h-12 rounded-none border-l-4 border-transparent pl-4 pr-3 text-base font-medium data-[active=true]:border-l-primary-500 data-[active=true]:bg-primary-50 data-[active=true]:text-primary-500 hover:text-primary-500 hover:bg-primary-50 transition-all duration-200 ease-in-out hover:scale-105 w-full"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <Icon className="size-5 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="bg-white p-3">
          {/* User info section */}
          {user && state === 'expanded' && (
            <div className="mb-2 rounded-lg bg-[#f8f9fb] px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-[#1a1a2e]">
                {user.username}
              </p>
              <p className="truncate text-xs text-[#6b7280]">
                {user.email}
              </p>
            </div>
          )}

          <Separator className="mb-2" />

          {/* Change Password */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Đổi mật khẩu"
                onClick={() => setChangePwOpen(true)}
                className="h-10 rounded-none border-l-4 border-transparent pl-4 pr-3 text-sm font-medium hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 w-full"
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="size-4 shrink-0" />
                  <span>Đổi mật khẩu</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Logout */}
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Đăng xuất"
                onClick={handleLogout}
                disabled={loggingOut}
                className="h-10 rounded-none border-l-4 border-transparent pl-4 pr-3 text-sm font-medium hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="size-4 shrink-0" />
                  <span>{loggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <Separator className="my-2" />

          {/* Collapse toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="h-10 w-full hover:bg-primary-50 hover:text-primary-500 transition-all duration-200 outline-none">
                <div
                  className={`flex w-full items-center gap-2 ${state === 'expanded' ? 'items-start' : 'justify-center'}`}
                >
                  {state === 'expanded' ? (
                    <>
                      <ChevronLeft className="size-5" />
                      <span>Thu gọn</span>
                    </>
                  ) : (
                    <ChevronRight className="size-5" />
                  )}
                </div>
              </SidebarTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" hidden={state === 'expanded'}>
              Mở rộng sidebar
            </TooltipContent>
          </Tooltip>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <ChangePasswordDialog open={changePwOpen} onOpenChange={setChangePwOpen} />
    </>
  );
}
