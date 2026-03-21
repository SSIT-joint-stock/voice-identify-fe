import * as React from "react";
import { BookOpenText, Home, Mic, Search, UsersRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/constants";

const navigation = [
  {
    title: "Trang chủ",
    url: ROUTES.HOME,
    icon: Home,
  },
  {
    title: "Đăng ký giọng nói",
    url: ROUTES.VOICE_ENROLL,
    icon: Mic,
  },
  {
    title: "Tra cứu 1 người",
    url: ROUTES.VOICE_SEARCH_SINGLE,
    icon: Search,
  },
  {
    title: "Tra cứu 1-2 người",
    url: ROUTES.VOICE_SEARCH_MULTI,
    icon: UsersRound,
  },
  {
    title: "Hướng dẫn sử dụng",
    url: ROUTES.VOICE_GUIDE,
    icon: BookOpenText,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 border-b">
        <Link
          to={ROUTES.VOICE_SEARCH_SINGLE}
          className="flex h-full items-center gap-2 overflow-hidden px-3 font-semibold group-data-[collapsible=icon]:justify-center"
        >
          <img
            src="/logo1.png"
            alt="logo"
            className="h-6 w-6 shrink-0 object-contain"
          />
          <span className="block min-w-0 flex-1 truncate text-sm font-semibold leading-tight group-data-[collapsible=icon]:hidden">
            Hệ thống nhận diện đối tượng dựa trên đặc điểm sinh trắc giọng nói
            và dịch đa ngôn ngữ
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="gap-1 px-2 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.url ||
              (item.url !== ROUTES.HOME &&
                location.pathname.startsWith(item.url));

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className="h-12 pl-5 pr-3 text-base"
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

      <SidebarRail />
    </Sidebar>
  );
}
