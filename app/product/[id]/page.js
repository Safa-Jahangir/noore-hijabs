"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductDetail({ params }) {
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        setProduct(data);
        if (data?.colors?.length) setSelectedColor(data.colors[0]);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  const finalPrice =
    product.discount > 0
      ? Math.round(product.price - (product.price * product.discount) / 100)
      : product.price;

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12">

        <div className="relative bg-gray-100 h-[450px] rounded-lg flex items-center justify-center overflow-hidden border">
          {product.discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded font-bold z-10">
              {product.discount}% OFF
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="h-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-4xl font-semibold mb-4">{product.name}</h1>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="mt-4">
            {product.discount > 0 ? (
              <>
                <p className="text-3xl font-bold text-red-600">
                  Rs. {finalPrice}
                </p>
                <p className="text-lg line-through text-gray-500">
                  Rs. {product.price}
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold">
                Rs. {product.price}
              </p>
            )}
          </div>

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="font-medium mb-2">Select Color:</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-md border ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
  onClick={() =>
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.image,
      color: selectedColor || "default", // ✅ FIXED
    })
  }
  className="w-full py-3 rounded-md bg-black text-white hover:bg-gray-800"
>
  Add to Cart
</button>

          </div>
        </div>
      </div>
    </main>
  );
}
