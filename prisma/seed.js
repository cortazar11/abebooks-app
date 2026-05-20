import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // 1. NextAuth tables FIRST
   // CART
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()

  // ORDERS
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()

  // BOOKS
  await prisma.book.deleteMany()

  // NEXTAUTH
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()

  // USERS
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
    {
      title: "Clean Architecture",
      price: 28,
      sellerId: alice.id,
    },
    {
      title: "The Pragmatic Programmer",
      price: 32,
      sellerId: bob.id,
    },
    {
      title: "Design Patterns",
      price: 35,
      sellerId: carlos.id,
    },
    {
      title: "Effective Java",
      price: 29,
      sellerId: alice.id,
    },
    {
      title: "Code Complete",
      price: 34,
      sellerId: bob.id,
    },
    {
      title: "You Don't Know JS",
      price: 24,
      sellerId: carlos.id,
    },
    {
      title: "Head First Design Patterns",
      price: 26,
      sellerId: alice.id,
    },
    {
      title: "Introduction to Algorithms",
      price: 45,
      sellerId: bob.id,
    },
    {
      title: "The Mythical Man-Month",
      price: 22,
      sellerId: carlos.id,
    },
  ],
})

  console.log("Seed completed")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

