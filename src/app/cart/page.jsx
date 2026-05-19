import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import CheckoutButton from "@/components/cart/CheckoutButton"
import RemoveFromCartButton from "@/components/cart/RemoveFromCartButton"

export default async function CartPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <p>You must be logged in to view your cart.</p>
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  })

  const items = cart?.items || []

  const total = items.reduce((sum, item) => {
    return sum + item.book.price
  }, 0)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="border p-3 rounded flex justify-between"
              >
                <div>
                  <p className="font-semibold">{item.book.title}</p>
                  <p className="text-sm text-gray-500">
                    €{item.book.price}
                  </p>
                </div>
                 <RemoveFromCartButton
                      bookId={item.book.id}
                  />
              </li>
            ))}
          </ul>

          <div className="mt-6 font-bold">
            Total: €{total}
          </div>

          <CheckoutButton />
        </>
      )}
    </div>
  )
}