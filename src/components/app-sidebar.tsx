import * as React from "react";
import { BookOpenText, Home, Mic, Search } from "lucide-react";
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
    title: "Tra cứu giọng nói",
    url: ROUTES.VOICE_SEARCH,
    icon: Search,
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
      <SidebarHeader className="border-b">
        <Link
          to={ROUTES.VOICE_SEARCH}
          className="flex items-center gap-2 px-2 py-6 font-semibold"
        >
          <img src="/logo1.png" alt="logo" className="w-6 h-6 object-contain" />
          <span className="text-sm font-semibold leading-tight line-clamp-2 group-data-[collapsible=icon]:hidden">
            HỆ THỐNG NHẬN DIỆN GIỌNG NÓI
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
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
                  className="h-12 px-3 text-base"
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
