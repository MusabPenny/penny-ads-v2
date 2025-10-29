import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role_types: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, roles } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const roleArray = Array.isArray(roles) && roles.length ? roles : ["user"];
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        isActive: true,
        updatedAt: new Date(),
        roles: {
          create: roleArray.map((roleName) => ({
            updated_at: new Date(),
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
        roles: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
