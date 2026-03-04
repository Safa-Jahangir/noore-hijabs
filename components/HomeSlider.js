"use client";

import { useEffect, useState } from "react";

export default function HomeSlider() {
  const images = [
    "/slider1.jpg",
    "/slider2.jpg",
    "/slider3.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[400px] relative overflow-hidden rounded-xl">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="Showcase"
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}