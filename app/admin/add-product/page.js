"use client";

import { useState } from "react";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "hijab", // Default value
    stock: "",
    discount: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          description: form.description,
          image: form.image,
          category: form.category, // Added category here
          discount: Number(form.discount) || 0,
          stock: Number(form.stock) || 0,
        }),
      });

      if (response.ok) {
        alert("Product added successfully!");
        // Reset form
        setForm({ 
          name: "", 
          price: "", 
          description: "", 
          image: "", 
          category: "hijab",
          stock: "",
          discount: "" 
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <input
          placeholder="Product Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        {/* Price Input */}
        <input
          type="number"
          placeholder="Price (PKR)"
          className="w-full border p-2 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        {/* Category Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border p-2 rounded bg-white"
          >
            <option value="hijab">Hijab</option>
            <option value="abaya">Abaya</option>
            <option value="deal">Deal</option>
          </select>
        </div>

        {/* Image Input */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
              setForm({ ...form, image: reader.result });
            };
            if (file) reader.readAsDataURL(file);
          }}
          className="w-full border p-2 rounded"
        />

        {/* Description Input */}
        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows="4"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button 
          type="submit" 
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors"
        >
          Save Product
        </button>
      </form>
    </main>
  );
}