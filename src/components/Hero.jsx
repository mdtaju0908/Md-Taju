import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

import api from "../utils/api";

const Hero = () => {
  const [bgUrl, setBgUrl] = useState(() => localStorage.getItem("siteHeroBgUrl") || "");
  const [ready, setReady] = useState(true);
  const [brand, setBrand] = useState({ name: "", title: "" });
  const [images, setImages] = useState([]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [intervalMs, setIntervalMs] = useState(6000);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bgRes, brandRes] = await Promise.all([
          api.get("/about/hero-backgrounds"),
          api.get("/config/brand"),
        ]);
        const imgs = Array.isArray(bgRes?.data?.images) ? bgRes.data.images : [];
        const s = bgRes?.data?.settings || {};
        setImages(imgs);
        setAutoRotate(typeof s.autoRotate === 'boolean' ? s.autoRotate : true);
        setIntervalMs(typeof s.intervalMs === 'number' ? s.intervalMs : 6000);
        
        const firstUrl = imgs[0] || "";
        const persisted = localStorage.getItem("siteHeroBgUrl");
        const targetUrl = firstUrl || persisted || "";
        if (targetUrl && targetUrl !== bgUrl) {
          setReady(false);
          const img = new Image();
          img.onload = () => {
            setBgUrl(targetUrl);
            localStorage.setItem("siteHeroBgUrl", targetUrl);
            setReady(true);
          };
          img.onerror = () => {
            localStorage.removeItem("siteHeroBgUrl");
            setReady(true);
          };
          img.src = targetUrl;
        }
        if (brandRes?.data) {
          setBrand({ name: brandRes.data.name || "Md Taju", title: brandRes.data.title || "Full-Stack Developer & Software Engineer" });
        }
      } catch (e) {
        // silent
      }
    };
    fetchData();
  }, []);

  // Auto-rotate logic
  useEffect(() => {
    if (!autoRotate || images.length < 2) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, Math.max(2000, intervalMs));
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRotate, intervalMs, images.length]);

  // Preload and update bgUrl when index changes
  useEffect(() => {
    if (!images.length) return;
    const url = images[index];
    if (!url || url === bgUrl) return;
    setReady(false);
    const img = new Image();
    img.onload = () => {
      setNextUrl(url);
      setSliding(true);
      const duration = 700;
      setTimeout(() => {
        setBgUrl(url);
        localStorage.setItem("siteHeroBgUrl", url);
        setNextUrl(null);
        setSliding(false);
        setReady(true);
      }, duration);
    };
    img.onerror = () => {
      setReady(true);
    };
    img.src = url;
  }, [index, images, bgUrl]);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-16 relative bg-center bg-cover md:bg-fixed bg-gray-900"
      style={{
        backgroundImage: images.length === 0 && bgUrl ? `url(${bgUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {images.length > 0 && (
        <div className="absolute inset-0 overflow-hidden z-0" aria-hidden="true">
          {bgUrl && (
            <img
              src={bgUrl}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 ease-in-out ${sliding ? "-translate-x-full" : "translate-x-0"}`}
              style={{ willChange: "transform" }}
            />
          )}
          {nextUrl && (
            <img
              src={nextUrl}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 ease-in-out ${sliding ? "translate-x-0" : "translate-x-full"}`}
              style={{ willChange: "transform" }}
            />
          )}
        </div>
      )}
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/40 backdrop-blur-sm transition-opacity duration-700"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        {!ready && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-xs">Loading background…</div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-6"
        >
          Hi, I'm <span className="text-blue-500">{brand.name || "𝙈𝙙 𝙏𝙖𝙟𝙪"}</span>
        </motion.h2>

        {/* TYPING TEXT */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-200 mb-8 font-medium min-h-[60px]"
        >
          <Typewriter
            words={[
              `${brand.title || "Full-Stack Developer & Software Engineer"}`,
              "Building modern and scalable web experiences",
              "I love clean UI, smart logic & modern tech",
              "Exploring Artificial Intelligence & Machine Learning",
              "Turning complex problems into simple solutions",
            ]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={50}
            deleteSpeed={0}
            delaySpeed={600}   // 🔥 0.8 sec pause (UX rule)
          />
        </motion.h2>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#projects"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-3 bg-white/90 text-blue-600 font-semibold rounded-lg shadow-md hover:bg-white transition"
          >
            Contact Me
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
