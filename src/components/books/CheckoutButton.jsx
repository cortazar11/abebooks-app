"use client"

export default function CheckoutButton({
  book,
}) {
  const handleAddToCart = async () => {
  const res = await fetch("/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookId: book.id,
    }),
  })

  if (!res.ok) {
    console.error("Failed to add to cart")
    return
  }

  console.log("Added to cart")
}

  // async function handleBuy() {
  //   const res = await fetch(
  //     "/api/checkout",
  //     {
  //       method: "POST",

  //       headers: {
  //         "Content-Type":
  //           "application/json",
  //       },

  //       body: JSON.stringify({
  //         bookId: book.id  ,
  //       }),
  //     }
  //   )

  //   if (!res.ok) {
  //       console.error("Checkout failed")
  //       return
  //     }

  //   const data = await res.json()

  //   window.location.href = data.url
  // }

 

  return (
    <button
      onClick={handleAddToCart}
      className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-black transition"
    >
      Add to Cart
    </button>
  )
}