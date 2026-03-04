"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      localStorage.setItem("admin-auth", "true");
      router.push("/admin");
    } else {
      alert("Wrong password");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="border p-8 rounded w-80">
        <h1 className="text-xl mb-4 text-center">Admin Login</h1>

        <input
          type="password"
          placeholder="Enter password"
          className="w-full border p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </main>
  );
}
