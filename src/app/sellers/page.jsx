import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function SellersPage({ searchParams }) {
  const order = searchParams?.order === "az" ? "asc" : "desc"

  const sellers = await prisma.user.findMany({
    where: {
      books: {
        some: {},
      },
    },
    include: {
      books: true,
    },
    orderBy: {
      name: order,
    },
  })

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Sellers
          </h1>

          <p className="text-gray-500 mt-1">
            Browse independent booksellers
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Order:
          </span>

          <Link
            href="/sellers?order=az"
            className={`px-3 py-1 rounded-md text-sm border ${
              order === "asc"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            A–Z
          </Link>

          <Link
            href="/sellers"
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

      {/* Sellers list */}
      <div className="space-y-3">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="grid grid-cols-[80px_1fr_160px] gap-6 items-center border border-gray-200 rounded-lg px-5 py-4 hover:bg-gray-50 transition"
          >
            
            {/* LEFT — avatar */}
            <div className="w-16 h-16 bg-gray-100 border rounded-full flex items-center justify-center text-xs text-gray-400">
              Avatar
            </div>

            {/* CENTER — seller info */}
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {seller.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {seller.books.length} books available
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Seller description placeholder for later...
              </p>
            </div>

            {/* RIGHT — actions */}
            <div className="flex flex-col items-end gap-3">
              <p className="text-sm text-gray-500">
                Trusted seller
              </p>

              <button className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-black transition">
                View seller
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sellers.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No sellers available yet.
        </div>
      )}
    </main>
  )
}