import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <p>You must be logged in to view your orders.</p>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return <p>User not found</p>
  }

  const orders = await prisma.order.findMany({
    where: {
      buyerId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const totalSpent = orders
  .filter(o => o.status === "paid")
  .reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">My Orders</h1>

    <p className="text-lg text-gray-700 mb-6">
          Total spent: <span className="font-semibold">€{totalSpent}</span>
    </p>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Order #{order.id.slice(-6)}
                </p>

                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={
                      order.status === "paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {order.status}
                  </span>
                </p>

                <p className="text-sm text-gray-500">
                  Created:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-lg font-bold">
                €{order.totalAmount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}