import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req) {
  const body = await req.json()

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: hashedPassword
    },
  })

  return Response.json(user)
}