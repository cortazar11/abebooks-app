import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  const book = await prisma.book.create({
    data: {
      title: body.title,
      price: body.price,
      sellerId: user.id,
    },
  })

  return Response.json(book)
}