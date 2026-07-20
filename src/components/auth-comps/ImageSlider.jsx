import { useState, useEffect } from "react";
import doctorImg from "../../assets/lcu.jpg";
import heartImg from "../../assets/pic1lcu.jpg";
import surgeryImg from "../../assets/pic2lcu.jpg";

export default function ImageSlider() {
  const images = [doctorImg, heartImg, surgeryImg];
  const [current, setCurrent] = useState(0);

  // Automatically change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden">

  {images.map((img, index) => (
    <div
      key={index}
      className={`absolute inset-0 transition-opacity duration-1000 ${
        current === index ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src={img}
        className="w-full h-full object-cover"
        alt=""
      />

      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-700/30" />
    </div>
  ))}

  <div className="absolute inset-0 z-10 flex flex-col justify-between p-12">

    <div>

      {/* Logo */}

      {/* <div className="flex items-center gap-3 mb-10">

        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center">

          📍

        </div>

        <h1 className="text-3xl font-bold text-white">
          RadX
        </h1>

      </div> */}

      <h2 className="text-5xl font-bold leading-tight text-white">

        Smart Attendance.
        <br />

        <span className="text-blue-300">
          Stronger Engagement.
        </span>

      </h2>

      <p className="mt-6 text-lg text-blue-100 max-w-lg">

        Geolocation-based attendance management with
        gamified student engagement.

      </p>

      <div className="flex gap-8 mt-10 text-white">

        <span>📍 GPS Verified</span>

        <span>🛡 Secure & Reliable</span>

        <span>🏆 Gamified Learning</span>

      </div>

    </div>

    <div className="flex gap-2">

      {images.map((_, index) => (

        <div
          key={index}
          className={`h-2 rounded-full transition-all ${
            current === index
              ? "bg-white w-8"
              : "bg-white/40 w-2"
          }`}
        />

      ))}

    </div>

  </div>

</div>
  );
}
