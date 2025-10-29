import { DeviceSidebar } from "@/components/device-sidebar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { TextManagementClient } from "@/components/text-management-client"
import { Type } from "lucide-react"

export default function TextManagement() {
  return (
    <div className="min-h-screen bg-background flex">
      <DeviceSidebar selectedDeviceId="" />

      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Type className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Text Management</h1>
                  <p className="text-sm text-muted-foreground">Create and style text content for display screens</p>
                </div>
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <TextManagementClient />
        </div>
      </div>
    </div>
  )
}
