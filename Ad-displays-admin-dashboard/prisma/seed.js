import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const rawPassword = "musab.kozlic";
  const secretKey = process.env.JWT_SECRET;
  const passwordToHash = rawPassword + secretKey;
  const hashedPassword = await bcrypt.hash(passwordToHash, 10);

  const user = await prisma.users.upsert({
    where: { email: "musab.kozlic@pennyplus.com" },
    update: {},
    create: {
      email: "musab.kozlic@pennyplus.com",
      password: hashedPassword,
      name: "Musab Kozlic",
      updatedAt: new Date(),
    },
  });

  console.log(user);

 await prisma.role_types.createMany({
    data: [
      { role_name: "user" },
      { role_name: "admin" },
      { role_name: "writer" },
    ],
  });

  const roles = await prisma.role_types.findMany({
    where: { role_name: { in: ["user", "admin", "writer"] } },
  });

  // Assign roles to user
  await prisma.roles.createMany({
    data: roles.map((role) => ({
      user_id: user.id,
      role_id: role.id,
    })),
  });

  console.log("✅ User seeded successfully!");
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
