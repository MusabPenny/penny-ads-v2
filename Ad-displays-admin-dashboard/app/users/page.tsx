import { UserManagementClient } from "@/components/user-management-client"

export default async function UsersPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage system users and their permissions</p>
        </div>
      </div>

      <UserManagementClient />
    </div>
  )
}
