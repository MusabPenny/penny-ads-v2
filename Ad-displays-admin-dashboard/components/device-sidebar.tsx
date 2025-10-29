"use client";

import { act, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Monitor,
  ChevronLeft,
  ChevronRight,
  Settings,
  Home,
  ImageIcon,
  Type,
  Users,
  ComputerIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DeviceSidebarProps {
  onDeviceSelect?: (deviceId: string) => void;
  selectedDeviceId?: string;
}

export function DeviceSidebar({
  onDeviceSelect,
  selectedDeviceId,
}: DeviceSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { icon: Home, label: "Displays", href: "/" },
    { icon: Monitor, label: "Devices", href: "/devices" },
    { icon: ComputerIcon, label: "Kase", href: "/kase" },
    { icon: Type, label: "Text Management", href: "/text-management" },
    { icon: Users, label: "Users", href: "/users" },
  ];

  return (
    <div
      className={cn(
        "h-full bg-card/50 backdrop-blur-sm border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Navigation</h2>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation Links */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start transition-all hover:bg-primary/10",
                      isCollapsed ? "px-2" : "px-3",
                      isActive && "bg-primary/10 text-primary"
                    )}
                    size="sm"
                  >
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
