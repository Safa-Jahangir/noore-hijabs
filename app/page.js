import Link from "next/link";
import HomeSlider from "@/components/HomeSlider";

// 1. FETCH DATA FROM API
async function getFeaturedProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const allProducts = await res.json();
  // Filter only featured products
  return allProducts.filter((p) => p.featured);
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main>
      {/* HERO SECTION */}
      <section className="bg-[#F7F5F2]">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10 items-center">
          
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-semibold leading-tight mb-6">
              Elegant Hijabs for<br />Everyday Grace
            </h1>
            <p className="text-gray-600 mb-8">
              Discover premium-quality hijabs crafted for comfort, elegance,
              and modest fashion — made for women in Pakistan.
            </p>

            <Link
              href="/products"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition"
            >
              Shop Now
            </Link>
          </div>

          {/* Right Content: The Slider replaces the grey placeholder */}
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-sm bg-white">
            <HomeSlider />
          </div>
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Featured Products
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product._id}
              className="relative border rounded-lg p-4 hover:shadow-md transition flex flex-col bg-white"
            >
              {/* FEATURED BADGE */}
              {product.featured && (
                <span className="absolute bottom-4 left-4 z-10 bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  Featured
                </span>
              )}

              {/* DISCOUNT BADGE */}
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  {product.discount}% OFF
                </div>
              )}

              {/* IMAGE */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded mb-4"
              />

              {/* NAME */}
              <h3 className="font-medium text-lg">{product.name}</h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* PRICE LOGIC */}
              <div className="mt-auto">
                {product.discount > 0 ? (
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-red-600">
                      Rs. {product.price - (product.price * product.discount) / 100}
                    </p>
                    <p className="text-sm line-through text-gray-400">
                      Rs. {product.price}
                    </p>
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-gray-900">
                    Rs. {product.price}
                  </p>
                )}
              </div>

              <Link
                href={`/product/${product._id}`}
                className="mt-4 block text-center text-sm border border-gray-900 py-2 rounded hover:bg-gray-900 hover:text-white transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}