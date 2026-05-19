import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // 1. NextAuth tables FIRST
  await prisma.order.deleteMany()
  await prisma.book.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // 3. Users
  const alice = await prisma.user.create({
    data: {
      name: "Alice Books",
      email: "alice@test.com",
    },
  })

  const bob = await prisma.user.create({
    data: {
      name: "Bob Library",
      email: "bob@test.com",
    },
  })

  const carlos = await prisma.user.create({
    data: {
      name: "Carlos Vintage",
      email: "carlos@test.com",
    },
  })

  // 4. Books
  await prisma.book.createMany({
    data: [
      {
        title: "Clean Code",
        price: 25,
        sellerId: alice.id,
      },
      {
        title: "Refactoring",
        price: 30,
        sellerId: bob.id,
      },
      {
        title: "Domain-Driven Design",
        price: 40,
        sellerId: carlos.id,
      },
    ],
  })

  console.log("Seed completed")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

