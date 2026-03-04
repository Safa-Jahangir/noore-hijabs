"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    router.push("/admin/login");
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

      <div className="flex gap-6 flex-wrap">
        <Link
          href="/admin/add-product"
          className="px-6 py-3 bg-black text-white rounded"
        >
          ➕ Add Product
        </Link>

        <Link
          href="/products"
          className="px-6 py-3 border rounded"
        >
          View Store
        </Link>

        <Link
          href="/admin/products"
          className="px-6 py-3 bg-gray-800 text-white rounded"
        >
          Manage Products
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 bg-red-600 text-white px-6 py-2 rounded"
      >
        Logout
      </button>
    </main>
  );
}
