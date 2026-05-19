import { getServerSession } from "next-auth"
import { sql } from "@vercel/postgres" // or your Neon client

export async function POST(req) {
  const session = await getServerSession()

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { title, author, price, description } = await req.json()

  await sql`
    INSERT INTO books (title, author, price, description, seller_id)
    VALUES (${title}, ${author}, ${price}, ${description}, ${session.user.id})
  `

  return Response.json({ success: true })
}