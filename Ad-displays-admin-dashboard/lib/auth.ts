import { tr } from "date-fns/locale"
import { prisma } from "./prisma"
import bcrypt from "bcrypt"

export interface User {
  id: number
  email: string
  name: string | null
  roles: Role[]
  isActive: boolean
  createdAt: Date | null
  updatedAt: Date | null
}

export interface Role {
  id: number
  user_id: number
  role_types: RoleType
  created_at: Date | null
  updated_at: Date | null
}

export interface RoleType {
  id: number
  role_name: string
}

export interface JWTPayload {
  userId: number
  email: string
  roles: string[]
}

// Simple hash function for passwords (not cryptographically secure, for demo only)
export async function hashPassword(password: string): Promise<string> {
  const secretKey = process.env.JWT_SECRET || ""
  const passwordToHash = password + secretKey
  const hashed = await bcrypt.hash(passwordToHash, 10) // 10 salt rounds
  return hashed
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const secretKey = process.env.JWT_SECRET;
  const passwordToCheck = password + secretKey;
  return await bcrypt.compare(passwordToCheck, hashedPassword);
}


export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = JSON.parse(atob(token))

    // Check expiration
    if (decoded.exp && decoded.exp < Date.now()) {
      return null
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles,
    }
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await prisma.users.findUnique({
    where: { email },
    include: {
      roles: {
        select: {
          id: true,
          user_id: true,
          created_at: true,
          updated_at: true,
          role_types: {
            select: {
              id: true,
              role_name: true
            }
          }
        }
      }
    }
  })


  if (!user || !user.isActive) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function hasRole(userRoles: RoleType[], requiredRole: RoleType): boolean {
  return userRoles.includes(requiredRole)
}

export function hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some((role) => userRoles.includes(role))
}
