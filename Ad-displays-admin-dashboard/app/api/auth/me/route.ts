import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "User not found or inactive" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
