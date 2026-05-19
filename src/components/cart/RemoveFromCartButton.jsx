"use client"

export default function RemoveFromCartButton({
  bookId,
}) {
  const handleRemove = async () => {
    const res = await fetch(
      "/api/cart/remove",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          bookId,
        }),
      }
    )

    if (!res.ok) {
      console.error("Failed to remove")
      return
    }

    window.location.reload()
  }

  return (
    <button
      onClick={handleRemove}
      className="text-sm text-red-500 hover:text-red-700"
    >
      Remove
    </button>
  )
}