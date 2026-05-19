import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 2. Get input
    const { bookId } = await req.json()

    if (!bookId) {
      return NextResponse.json(
        { error: "Missing bookId" },
        { status: 400 }
      )
    }

    // 3. Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // 4. Fetch book (IMPORTANT: prevent sold books)
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      )
    }

    if (book.sold) {
      return NextResponse.json(
        { error: "Book already sold" },
        { status: 400 }
      )
    }

    // 5. Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      })
    }

    // 6. Add item safely (avoid duplicates)
    await prisma.cartItem.upsert({
      where: {
        cartId_bookId: {
          cartId: cart.id,
          bookId,
        },
      },
      update: {},
      create: {
        cartId: cart.id,
        bookId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("CART_ERROR:", err)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}