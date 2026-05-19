import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  const session = await getServerSession(authOptions)

  console.log("SESSION:", session) 

  

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const dbUser = await prisma.user.findUnique({
  where: {
    email: session.user.email,
  },
})

  const { bookId } = await req.json()

  // 1. Find book
  const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
  })

  if (!book) {
    return NextResponse.json(
      { error: "Book not found" },
      { status: 404 }
    )
  }

  // 2. Create pending order
  const order = await prisma.order.create({
  data: {
    buyer: {
      connect: {
        id: dbUser.id,
      },
    },
    book: {
      connect: {
        id: book.id,
      },
    },
    amount: book.price,
    status: "pending",
  },
})

  // 3. Create Stripe checkout session
  const checkoutSession =
    await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "eur",

            product_data: {
              name: book.title,
            },

            unit_amount: Math.round(
              book.price * 100
            ),
          },

          quantity: 1,
        },
      ],

      metadata: {
        orderId: order.id,
      },

      success_url:
        "http://localhost:3000/success",

      cancel_url:
        "http://localhost:3000/cancel",
    })

  // 4. Save stripe session ID
  await prisma.order.update({
    where: {
      id: order.id,
    },

    data: {
      stripeSessionId:
        checkoutSession.id,
    },
  })

  if (book.sellerId === session.user.id) {
  return NextResponse.json(
    { error: "You cannot buy your own book" },
    { status: 400 }
  )
}

  return NextResponse.json({
    url: checkoutSession.url,
  })

}

