import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

import api from "../utils/api";

const Hero = () => {
  const [bgUrl, setBgUrl] = useState(() => localStorage.getItem("siteHeroBgUrl") || "");
  const [ready, setReady] = useState(true);
  const [brand, setBrand] = useState({ name: "", title: "" });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const [{ data }, brandRes] = await Promise.all([
          api.get("/about"),
          api.get("/config/brand"),
        ]);
        const url = data?.heroBg?.url || data?.heroBgUrl || "";
        if (url && url !== bgUrl) {
          setReady(false);
          const img = new Image();
          img.onload = () => {
            setBgUrl(url);
            localStorage.setItem("siteHeroBgUrl", url);
            setReady(true);
          };
          img.onerror = () => {
            localStorage.removeItem("siteHeroBgUrl");
            setReady(true);
          };
          img.src = url;
        }
        if (brandRes?.data) {
          setBrand({ name: brandRes.data.name || "Md Taju", title: brandRes.data.title || "Full-Stack Developer & Software Engineer" });
        }
      } catch (e) {
        // silent
      }
    };
    fetchAbout();
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-16 relative bg-center bg-cover md:bg-fixed bg-gray-900"
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
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
