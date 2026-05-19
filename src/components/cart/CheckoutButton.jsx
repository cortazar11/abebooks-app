"use client"

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const res = await fetch("/api/cart/checkout", {
      method: "POST",
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className="mt-4 bg-black text-white px-4 py-2 rounded"
    >
      Checkout
    </button>
  )
}