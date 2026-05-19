import PostBook from "@/components/PostBook"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>You must be logged in</div>
  }

  return (
    <div>
      <h1>Add Book</h1>
      <PostBook />
    </div>
  )
}