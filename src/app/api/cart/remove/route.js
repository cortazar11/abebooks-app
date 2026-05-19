import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const { bookId } = await req.json()

    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
    })

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: {
        cartId_bookId: {
          cartId: cart.id,
          bookId,
        },
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (err) {
    console.error("REMOVE_CART_ERROR:", err)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}