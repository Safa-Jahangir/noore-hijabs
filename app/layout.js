import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Nooré Hijabs",
  description: "Modesty with Grace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#F7F5F2] text-gray-800">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
