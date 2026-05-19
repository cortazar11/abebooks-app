import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <p>You must be logged in</p>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return <p>User not found</p>
  }

  // 1. All seller books
  const books = await prisma.book.findMany({
    where: {
      sellerId: user.id,
    },
  })

  const soldBooks = books.filter((b) => b.sold)

  // 2. Get seller book IDs (IMPORTANT FIX)
  const sellerBooks = await prisma.book.findMany({
    where: { sellerId: user.id },
    select: { id: true },
  })

  const bookIds = sellerBooks.map((b) => b.id)

  // 3. Orders for seller books (FIXED QUERY)
  const orders = await prisma.order.findMany({
  where: {
    status: "paid",
    items: {
      some: {
        book: {
          sellerId: user.id,
        },
      },
    },
  },
  include: {
    items: {
      include: {
        book: true,
      },
    },
    buyer: true,
  },
})

  // 4. Revenue
  const totalRevenue = books
    .filter((b) => b.sold)
    .reduce((sum, b) => sum + b.price, 0)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Seller Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Books</p>
          <p className="text-2xl font-bold">{books.length}</p>
        </div>

        <div className="border p-4 rounded-lg">
          <p className="text-sm text-gray-500">Sold Books</p>
          <p className="text-2xl font-bold">{soldBooks.length}</p>
        </div>

        <div className="border p-4 rounded-lg">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold">
            €{totalRevenue}
          </p>
        </div>
      </div>

      {/* ORDERS */}
      <h2 className="text-xl font-semibold mb-4">
        Recent Sales
      </h2>

      {orders.length === 0 ? (
        <p>No sales yet</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded-lg flex justify-between"
            >
              <div>
                <p className="font-medium">
                  Order #{order.id.slice(-6)}
                </p>
                <p className="text-sm text-gray-500">
                  Paid order
                </p>
              </div>

              <p className="font-bold">
                €{order.totalAmount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}