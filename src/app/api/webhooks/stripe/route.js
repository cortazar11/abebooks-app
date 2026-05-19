import { headers } from "next/headers"
import { NextResponse } from "next/server"

import Stripe from "stripe"

import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {

  const body = await req.text()

  const signature =
    (await headers()).get("stripe-signature")

  let event

  try {

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

  } catch (err) {

    console.log("Webhook error:", err.message)

    return NextResponse.json(
      { error: "Webhook error" },
      { status: 400 }
    )
  }

  // PAYMENT SUCCESS
  if (event.type === "checkout.session.completed") {
  const session = event.data.object
  const orderId = session.metadata.orderId

  // 1. mark order paid
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "paid" },
  })

  // 2. get cart items BEFORE deleting them
  const cart = await prisma.cart.findFirst({
    where: { userId: order.buyerId },
    include: { items: true },
  })

  const bookIds = cart?.items.map((i) => i.bookId) || []

  // 3. mark books as sold
  if (bookIds.length > 0) {
    await prisma.book.updateMany({
      where: {
        id: { in: bookIds },
      },
      data: {
        sold: true,
      },
    })
  }

  // 4. now clear cart
  await prisma.cartItem.deleteMany({
    where: {
      cart: {
        userId: order.buyerId,
      },
    },
  })

  console.log("ORDER PAID + BOOKS SOLD:", orderId)
}

  

  return NextResponse.json({ received: true })
}