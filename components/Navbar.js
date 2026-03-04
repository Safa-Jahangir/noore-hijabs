"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";

export default function Navbar() {
  const { cart } = useCart();
  // State to control the drawer visibility
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <>
      <nav className="w-full bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Brand */}
          <Link href="/" className="text-2xl font-semibold tracking-wide">
            Nooré Hijabs
          </Link>

          {/* Links & Cart Toggle */}
          <div className="flex items-center space-x-8 text-gray-700">
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-black transition">Home</Link>
              <Link href="/products" className="hover:text-black transition">Shop</Link>
              <Link href="/about" className="hover:text-black transition">About</Link>
              <Link href="/contact" className="hover:text-black transition">Contact</Link>
            </div>

            {/* Cart Button (Opens Drawer) */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-2 hover:bg-gray-100 rounded-full transition focus:outline-none"
            >
              <span className="text-xl">🛒</span>

              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Sliding Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </>
  );
}