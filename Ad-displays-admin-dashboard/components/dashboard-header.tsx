"use client"

import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { ImageIcon, Grid3X3, List } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
interface DashboardHeaderProps {
  selectedDevice: string
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export function DashboardHeader({ selectedDevice, viewMode, onViewModeChange }: DashboardHeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Display Manager</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">{user.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            )}
            <ThemeSwitcher />
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
