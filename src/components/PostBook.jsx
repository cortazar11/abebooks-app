"use client"

import { createBook } from "@/app/actions/books"

export default function PostBook() {
  return (
    <form action={createBook}>
      <input name="title" placeholder="Title" />
      <input name="price" type="number" step="0.01" required />
      <button type="submit">Add Book</button>
    </form>
  )
}