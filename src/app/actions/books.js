"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

export async function createBook(formData) {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("Unauthorized")

  const title = formData.get("title")
  const priceRaw = formData.get("price")

  const price = Number(priceRaw)

  if (!title || !priceRaw || isNaN(price)) {
    throw new Error("Invalid input")
  }

  await prisma.book.create({
    data: {
      title: String(title),
      price,
      sellerId: session.user.id,
    },
  })

  revalidatePath("/books")
}