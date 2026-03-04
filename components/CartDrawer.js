"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

  // 🟢 STEP 1 — Customer State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Main Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold tracking-tight">Your Shopping Cart</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
            ✕
          </button>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Your cart feels a bit light.</div>
          ) : (
            cart.map((item) => (
              <div key={item._id + (item.color || "default")} className="flex gap-4 items-start border-b pb-4">
                
                <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-400 uppercase">
                    Hijab
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>

                    <p className="text-sm font-semibold text-gray-900">
                      Rs {
                        item.discount && item.discount > 0
                          ? Math.round(item.price - (item.price * item.discount) / 100)
                          : item.price
                      }
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.color,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-2 py-1 hover:bg-gray-50 text-gray-600"
                      >
                        -
                      </button>

                      <span className="px-2 text-xs font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="px-2 py-1 hover:bg-gray-50 text-gray-600"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item._id, item.color)
                      }
                      className="text-[10px] text-red-500 hover:text-red-700 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Section */}
        {cart.length > 0 && (
          <div className="p-6 border-t bg-gray-50 overflow-y-auto">
            
            {/* 🟢 STEP 2 — Customer Form UI */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Delivery Details</p>
              <input
                type="text"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded-md p-3 text-sm focus:ring-1 focus:ring-black outline-none transition"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full border rounded-md p-3 text-sm focus:ring-1 focus:ring-black outline-none transition"
              />
              <input
                type="text"
                placeholder="Full Address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full border rounded-md p-3 text-sm focus:ring-1 focus:ring-black outline-none transition"
              />
              <input
                type="text"
                placeholder="City"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className="w-full border rounded-md p-3 text-sm focus:ring-1 focus:ring-black outline-none transition"
              />
            </div>

            <div className="flex justify-between text-base font-semibold text-gray-900 mb-4 pt-4 border-t">
              <span>Subtotal</span>
              <span>Rs {totalPrice}</span>
            </div>
            
            {/* 🟢 STEP 3 — Checkout Button with Validation */}
            <button
              onClick={() => {
                if (cart.length === 0) return;

                if (!customerName || !customerPhone || !customerAddress || !customerCity) {
                  alert("Please fill all customer details to proceed.");
                  return;
                }

                const message = cart
                  .map((item) => {
                    const finalPrice = item.discount && item.discount > 0
                      ? Math.round(item.price - (item.price * item.discount) / 100)
                      : item.price;
                    return `${item.name} x ${item.quantity} = Rs ${finalPrice * item.quantity}`;
                  })
                  .join("\n");

                const finalMessage = `*New Order from Nooré Hijabs*

*Customer Details:*
Name: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}
City: ${customerCity}

*Items:*
----------------------------
${message}
----------------------------

*Total:* Rs ${totalPrice}`;

                const whatsappURL = `https://wa.me/923445331729?text=${encodeURIComponent(finalMessage)}`;

                window.location.href = whatsappURL;
                clearCart();
                setIsOpen(false);
              }}
              className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Confirm via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}