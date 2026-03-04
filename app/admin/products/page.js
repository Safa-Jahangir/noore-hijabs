"use client";

import { useState, useEffect } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    featured: false,
    discount: 0,
    colors: [],
    stock: 0, // ✅ STEP 1: Added stock to initial state
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p._id !== id));
  };

  const toggleField = async (id, field, value) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    fetchProducts();
  };

  const startEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      image: product.image || "",
      inStock: product.inStock ?? true,
      featured: product.featured ?? false,
      discount: product.discount ?? 0,
      colors: product.colors || [],
      stock: product.stock ?? 0, // ✅ Ensure stock is loaded into form
    });
  };

  const saveEdit = async () => {
    // ✅ STEP 4: Ensure Stock is sent to Backend as a Number
    await fetch(`/api/admin/products/${editing}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        description: form.description,
        discount: Number(form.discount),
        colors: form.colors,
        stock: Number(form.stock), 
      }),
    });
    setEditing(null);
    fetchProducts();
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Admin: Manage Products</h1>

      <div className="overflow-x-auto shadow-sm border rounded-lg">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-700">
              <th className="p-4 font-semibold">Image</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Featured</th>
              <th className="p-4 font-semibold text-center">Discount</th>
              <th className="p-4 font-semibold">Colors</th>
              <th className="p-4 font-semibold text-center">Stock</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <img src={product.image} alt="" className="w-12 h-12 object-cover rounded" />
                </td>

                <td className="p-4 font-medium">
                  {editing === product._id ? (
                    <input
                      className="border rounded p-1 w-full"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  ) : (product.name)}
                </td>

                <td className="p-4">
                  {editing === product._id ? (
                    <input
                      type="number"
                      className="border rounded p-1 w-24"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                  ) : (<span>Rs. {product.price}</span>)}
                </td>

                <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-yellow-600"
                      checked={product.featured}
                      onChange={() => toggleField(product._id, "featured", !product.featured)}
                    />
                </td>

                <td className="p-4 text-center">
                  {editing === product._id ? (
                    <input
                      type="number"
                      className="border rounded p-1 w-16"
                      value={form.discount}
                      onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    />
                  ) : (`${product.discount}%`)}
                </td>

                <td className="p-4 text-xs">
                   {editing === product._id ? (
                    <input
                      className="border rounded p-1 w-full"
                      value={form.colors?.join(", ")}
                      onChange={(e) => setForm({ ...form, colors: e.target.value.split(",").map(c => c.trim()) })}
                    />
                  ) : (product.colors?.join(", "))}
                </td>

                {/* ✅ STEP 3: Added Stock Input/Display Logic */}
                <td className="p-4 text-center">
                  {editing === product._id ? (
                    <input
                      type="number"
                      className="border rounded p-1 w-16 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    />
                  ) : (
                    <span className={`font-mono font-bold ${product.stock < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                      {product.stock}
                    </span>
                  )}
                </td>

                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {editing === product._id ? (
                      <button onClick={saveEdit} className="text-green-600 font-bold">Save</button>
                    ) : (
                      <button onClick={() => startEdit(product)} className="text-blue-600">Edit</button>
                    )}
                    <button onClick={() => deleteProduct(product._id)} className="text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}