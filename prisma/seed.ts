import { prisma } from "#/db"

async function main() {

  await prisma.user.upsert({
    where: { email: "superadmin@domain.com" },
    update: {},
    create: {
      name: "Kazum Admin",
      email: "superadmin@domain.com",
      password: "123",
      role: "admin", // Langsung set sebagai admin di DB
      emailVerified: true,
    },
  });

  console.log("User pertama berhasil dibuat!");
}

main();
