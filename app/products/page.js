"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 STEP 1: Add Filter States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);

  // 🟢 STEP 4: Connect Filters To Backend
  useEffect(() => {
    setLoading(true);
    
    // Start with the base category filter
    let url = `/api/products?category=${selectedCategory}`;

    // Append Price Range if selected
    if (priceRange) {
      const [min, max] = priceRange.split("-");
      url += `&min=${min}&max=${max}`;
    }

    // Append Discount toggle if true
    if (discountOnly) {
      url += `&discounted=true`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [selectedCategory, priceRange, discountOnly]); // Refetch when any filter changes

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-semibold mb-10 text-center capitalize">
        {selectedCategory === "all" ? "Shop All" : `Shop ${selectedCategory}s`}
      </h1>

      {/* Category Filter Buttons */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {["all", "hijab", "abaya", "deal"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full border transition-all ${
              selectedCategory === cat
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-300 hover:border-black"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* 🟢 STEP 3: Add Filter UI (Price & Discount) */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-12 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Price:</label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="border p-2 rounded bg-white text-sm outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">All Prices</option>
            <option value="0-1000">Under 1000</option>
            <option value="1000-2000">1000 - 2000</option>
            <option value="2000-100000">2000+</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 accent-black"
            checked={discountOnly}
            onChange={(e) => setDiscountOnly(e.target.checked)}
          />
          <span className="text-sm font-medium text-gray-700">Discounted Only</span>
        </label>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Updating results...</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => {
              const finalPrice =
                product.discount > 0
                  ? Math.round(product.price - (product.price * product.discount) / 100)
                  : product.price;

              return (
                <div
                  key={product._id}
                  className="relative border rounded-lg p-4 hover:shadow-md transition flex flex-col bg-white"
                >
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded mb-4"
                  />

                  <h3 className="font-medium text-lg">{product.name}</h3>

                  <div className="mt-1 mb-2">
                    {product.stock === 0 ? (
                      <p className="text-red-600 text-xs font-bold uppercase">Out of Stock</p>
                    ) : product.stock <= 5 ? (
                      <p className="text-orange-600 text-xs font-bold uppercase animate-pulse">
                        Only {product.stock} Left 🔥
                      </p>
                    ) : (
                      <p className="text-green-600 text-xs font-bold uppercase">In Stock</p>
                    )}
                  </div>

                  <div className="mt-auto flex justify-between items-end">
                    <div>
                      {product.discount > 0 ? (
                        <>
                          <p className="text-lg font-bold text-red-600 leading-tight">
                            Rs. {finalPrice}
                          </p>
                          <p className="text-sm line-through text-gray-400">
                            Rs. {product.price}
                          </p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-gray-900">Rs. {product.price}</p>
                      )}
                    </div>

                    <Link
                      href={`/product/${product._id}`}
                      className={`text-sm px-4 py-2 border rounded transition ${
                        product.stock > 0
                          ? "border-gray-900 hover:bg-gray-900 hover:text-white"
                          : "border-gray-300 bg-gray-100 cursor-not-allowed text-gray-400 pointer-events-none"
                      }`}
                    >
                      {product.stock > 0 ? "View" : "Sold Out"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products match these filters.</p>
              <button 
                onClick={() => { setSelectedCategory("all"); setPriceRange(""); setDiscountOnly(false); }}
                className="mt-4 text-black underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}