
import React, { ReactNode } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Home, UserPlus, Search, Calendar, FileText, Settings, Activity, Users } from 'lucide-react';

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Register Patient",
    url: "/register",
    icon: UserPlus,
  },
  {
    title: "Patient Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Prescriptions",
    url: "/prescriptions",
    icon: FileText,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: Activity,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <h2 className="text-lg font-bold text-slate-900 mb-1">DentalCare Pro</h2>
          <p className="text-sm text-slate-600">Clinic Management</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-4 border-b border-slate-200 bg-white">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
