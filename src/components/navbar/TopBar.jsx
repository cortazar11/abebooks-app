import Link from "next/link"
import LoginButton from "@/components/auth/LoginButton"


export default function TopBar() {
  return (
    <div className="bg-gray-800 text-white py-2 px-4 flex justify-end">
      <LoginButton />
      <Link href="/cart" className="ml-4">
        Cart
      </Link>
    </div>
  )
}
