import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  try {
    // 1. Auth
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // 2. Load cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      )
    }

    // 3. Check for already sold books
    const soldBook = cart.items.find(item => item.book.sold)

    if (soldBook) {
      return NextResponse.json(
        { error: "One or more books are already sold" },
        { status: 400 }
      )
    }

    // 4. Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.book.price,
      0
    )

    // 5. Create order
    const order = await prisma.order.create({
      data: {
        buyerId: user.id,
        totalAmount,
        status: "pending",
      },
    })

    // 6. Stripe line items
    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.book.title,
        },
        unit_amount: Math.round(item.book.price * 100),
      },
      quantity: 1,
    }))

    // 7. Stripe session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items,

      metadata: {
        orderId: order.id,
      },

      // success_url: "http://localhost:3000/success",
      // cancel_url: "http://localhost:3000/cancel",
      success_url: "https://abebooks-app.vercel.app/success",
      cancel_url: "https://abebooks-app.vercel.app/cancel",
    })

    // 8. Save Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: checkoutSession.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error("CART_CHECKOUT_ERROR:", err)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}