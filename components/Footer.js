export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Nooré Hijabs</h3>
          <p className="text-sm">
            Modesty with Grace.  
            Premium hijabs designed for everyday elegance.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li>Shop</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm">WhatsApp Orders Available</p>
          <p className="text-sm">Pakistan 🇵🇰</p>
        </div>

      </div>

      <div className="text-center text-xs py-4 bg-gray-950">
        © {new Date().getFullYear()} Nooré Hijabs. All rights reserved.
      </div>
    </footer>
  );
}
