"use client"

import { useState } from "react"

export default function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    await fetch("/api/signup", {
      method: "POST",
      headers: {    "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    alert("User created")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Sign up</button>
    </form>
  )
}