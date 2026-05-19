"use client"

import { createBook } from "@/app/actions/books"

export default function PostBook() {
  return (
    <form action={createBook}>
      <input name="title" placeholder="Title" />
      <input name="price" placeholder="Price" />
      <button type="submit">Add Book</button>
    </form>
  )
}