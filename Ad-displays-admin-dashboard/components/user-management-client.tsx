"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Shield,
  PenTool,
  Loader2,
} from "lucide-react";
import { format, set } from "date-fns";
import { useAuth } from "@/lib/contexts/auth-context";
import { User } from "@/lib/auth";

const availableRoles = [
  { id: "user", label: "User", icon: Users, description: "Basic user access" },
  {
    id: "admin",
    label: "Admin",
    icon: Shield,
    description: "Full system access",
  },
  {
    id: "writter",
    label: "Writer",
    icon: PenTool,
    description: "Content creation access",
  },
];

export function UserManagementClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    roles: ["user"],
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        const isAdmin = data.some((user: User) => user.roles.map(role => role.role_types.role_name).includes("admin"));
        setIsAdmin(isAdmin);
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchUsers();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        alert(error.error || "Operation failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: "",
      name: user.name || "",
      roles: user.roles.map(role => role.role_types.role_name),
      isActive: user.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Network error. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      roles: ["user"],
      isActive: true,
    });
    setEditingUser(null);
  };

  const handleRoleChange = (roleId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        roles: [...prev.roles, roleId],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        roles: prev.roles.filter((role) => role !== roleId),
      }));
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "writer":
        return "default";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              System Users
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={resetForm}
                  disabled={!user || !isAdmin}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "Edit User" : "Add New User"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password {editingUser && "(Leave empty to keep current)"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required={!editingUser}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Roles</Label>
                    {availableRoles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <div
                          key={role.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={role.id}
                            checked={formData.roles.includes(role.id)}
                            onCheckedChange={(checked) =>
                              handleRoleChange(role.id, checked as boolean)
                            }
                          />
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label
                                htmlFor={role.id}
                                className="text-sm font-medium"
                              >
                                {role.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {role.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isActive: checked }))
                      }
                    />
                    <Label htmlFor="isActive">Active User</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingUser ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>{editingUser ? "Update User" : "Create User"}</>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {user.name || "No name"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.map((role) => (
                        <Badge
                          key={role.role_types.id}
                          variant={getRoleBadgeVariant(
                            role.role_types.role_name
                          )}
                          className="text-xs"
                        >
                          {role.role_types.role_name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.createdAt
                      ? format(new Date(user.createdAt), "MMM dd, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
