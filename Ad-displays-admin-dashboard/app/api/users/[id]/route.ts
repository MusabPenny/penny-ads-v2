import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: Promise<string> } }
) {
  try {
    const { email, password, name, roles, isActive } = await request.json();
    const paramsUserId = await params.id;
    const userId = Number.parseInt(paramsUserId);

    if (!userId) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const roleArray = Array.isArray(roles) && roles.length ? roles : ["user"];

    const updateData: any = {
      email,
      name: name || null,
      roles: roleArray,
      isActive: isActive !== undefined ? isActive : true,
    };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        email,
        name: name || null,
        isActive: isActive !== undefined ? isActive : true,
        ...(password ? { password: await hashPassword(password) } : {}),
        roles: {
          deleteMany: {},
          create: roleArray.map((roleName: string) => ({
            role_types: {
              connect: { role_name: roleName },
            },
          })),
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        roles: {
          select: {
            role_types: true,
          },
        },
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = Number.parseInt(params.id);

    if (!userId) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Soft delete - mark as inactive
    await prisma.users.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
