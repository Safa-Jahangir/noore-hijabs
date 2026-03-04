"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  }
  return [];
});


  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add to cart (FIXED)
  const addToCart = (product) => {
    if (!product._id) {
      console.error("Product missing _id");
      return;
    }

    const productColor = product.color || "default";

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item._id === product._id &&
          (item.color || "default") === productColor
      );

      if (existing) {
        return prev.map((item) =>
          item._id === product._id &&
          (item.color || "default") === productColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          color: productColor,
          quantity: 1,
        },
      ];
    });
  };

  // ✅ Update quantity
  const updateQuantity = (_id, color, newQuantity) => {
    const safeColor = color || "default";

    setCart((prev) =>
      prev.map((item) =>
        item._id === _id &&
        (item.color || "default") === safeColor
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // ✅ Remove item
  const removeFromCart = (_id, color) => {
    const safeColor = color || "default";

    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item._id === _id &&
            (item.color || "default") === safeColor
          )
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // ✅ Total price calculation (FIXED)
  const totalPrice = cart.reduce((sum, item) => {
    const basePrice = Number(item.price || 0);
    const discount = Number(item.discount || 0);

    const finalPrice =
      discount > 0
        ? Math.round(basePrice - (basePrice * discount) / 100)
        : basePrice;

    return sum + finalPrice * Number(item.quantity || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
