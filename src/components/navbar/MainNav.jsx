import Link from "next/link";

export default function MainNav() {
  return (
    <nav className="bg-white shadow">   
        <div className="container mx-auto px-4 py-3 flex justify-center items-center"> 
            
            <div className="space-x-6">     
                <Link href="/" className="text-gray-600 hover:text-gray-800">Home</Link>
                <Link href="/books" className="text-gray-600 hover:text-gray-800">Books</Link>
                <Link href="/sellers" className="text-gray-600 hover:text-gray-800">Sellers</Link>
                <Link href="/books/new" className="text-gray-600 hover:text-gray-800">Start Selling</Link>
                <Link href="/orders" className="text-gray-600 hover:text-gray-800">My Orders</Link>
            </div>
        </div>
    </nav>
  )
}