import * as React from "react";
import { BookOpenText, Home, Mic, Search, UsersRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/constants";

const navigation = [
  { title: "Trang chủ", url: ROUTES.HOME, icon: Home },
  { title: "Đăng ký giọng nói", url: ROUTES.VOICE_ENROLL, icon: Mic },
  { title: "Tra cứu 1 người", url: ROUTES.VOICE_SEARCH_SINGLE, icon: Search },
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
      <SidebarContent className="bg-white">
        <SidebarMenu className="gap-2 px-3 py-6">
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
                  className="h-12 rounded-none border-l-4 border-transparent pl-4 pr-3 text-[17px] font-medium data-[active=true]:border-l-[#8b0000] data-[active=true]:bg-[#f6f1ef] data-[active=true]:text-[#5a150d]"
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
