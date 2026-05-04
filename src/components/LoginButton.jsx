"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function LoginButton() {
    console.log("LoginButton rendered")
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <p>{session.user?.name}</p>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    )
  }

  return (
    <button onClick={() => signIn("github")} >
      Login with GitHub
    </button>
  )
}