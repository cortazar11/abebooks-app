"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function LoginButton() {
    console.log("LoginButton rendered")
  const { data: session } = useSession()

  if (session) {
    return (
       <div className="flex items-center gap-4 text-white">
        <p>{session.user?.name}</p>
        <Link
          href="/dashboard"
          className="hover:text-gray-300"
        >
          Dashboard
        </Link>
        <button onClick={() => signOut()} className="hover:text-gray-300">
          Logout
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => signIn("github")} className="hover:text-gray-300">
      Login with GitHub
    </button>
  )
}