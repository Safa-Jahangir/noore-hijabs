"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Safe total calculation
  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const handleOrder = async () => {
    if (!name || !phone || !address || !city) {
      alert("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    // ✅ Recalculate total INSIDE function (important)
    const calculatedTotal = cart.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          address,
          city,
          items: cart,
          total: calculatedTotal, // ✅ send correct total
        }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        alert("Order placed successfully!");
        router.refresh();
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => {
        const itemSubtotal =
          Number(item.price || 0) * Number(item.quantity || 0);

        return (
          <div key={item.id + item.color} style={{ marginBottom: 15 }}>
            <strong>{item.name}</strong>
            <p>Color: {item.color || "N/A"}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: Rs {item.price}</p>
            <p>Subtotal: Rs {itemSubtotal}</p> {/* ✅ per item subtotal */}
            <button onClick={() => removeFromCart(item.id, item.color)}>
              Remove
            </button>
          </div>
        );
      })}

      {cart.length > 0 && (
        <>
          <h2>Total: Rs {total}</h2>
          <hr />
        </>
      )}

      <h2>Customer Details</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />
      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />
      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <br />

      <button onClick={handleOrder} disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
