import { prisma } from "@/lib/prisma"
import Link from "next/link"
import CheckoutButton from "@/components/books/CheckoutButton"

export const dynamic = "force-dynamic"

export default async function BooksPage(props) {
  const searchParams = await props.searchParams

  const order = searchParams?.order === "az"
    ? "asc"
    : "desc"

   const books = await prisma.book.findMany({
    orderBy: {
      title: order,
    },
     where: {
        sold: false,
      },
  })

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Books
          </h1>

          <p className="text-gray-500 mt-1">
            Browse books from independent sellers
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Order:
          </span>

          <Link
            href="/books?order=az"
            className={`px-3 py-1 rounded-md text-sm border ${
              order === "asc"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            A–Z
          </Link>

          <Link
            href="/books"
            className={`px-3 py-1 rounded-md text-sm border ${
              order === "desc"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Newest
          </Link>
        </div>
      </div>

      {/* Books list */}
      <div className="space-y-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="grid grid-cols-[80px_1fr_160px] gap-6 items-center border border-gray-200 rounded-lg px-5 py-4 hover:bg-gray-50 transition"
          >
            
            {/* LEFT — image */}
            <div className="w-16 h-20 bg-gray-100 border rounded-md flex items-center justify-center text-xs text-gray-400">
              Image
            </div>

            {/* CENTER — info */}
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {book.title}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Author · Condition · Seller
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Small description placeholder for later...
              </p>
            </div>

            {/* RIGHT — price/actions */}
            <div className="flex flex-col items-end gap-3">
              <p className="text-2xl font-semibold text-gray-900">
                {book.price} €
              </p>

              {/* <CheckoutButton bookId={book.id} /> */}
              <CheckoutButton book={book} />
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {books.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No books available yet.
        </div>
      )}
    </main>
  )
}