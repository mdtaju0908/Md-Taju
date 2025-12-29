import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Home', to: '#home' },
    { name: 'About', to: '#about' },
    { name: 'Qualifications', to: '#qualifications' },
    { name: 'Projects', to: '#projects' },
    { name: 'Gallery', to: '#gallery' },
    { name: 'Resume', to: '#resume' },
    { name: 'Contact', to: '#contact' },
  ];

  const handleScroll = (e, id) => {
    e.preventDefault();
    if (!isHome) {
      if (id === '#about') {
        window.location.href = '/about';
      } else {
        window.location.href = `/${id}`;
      }
      return;
    }
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed w-full z-50 backdrop-blur-md border-b border-cyan-400/20 bg-black/70 dark:bg-black/80 overflow-hidden">
      
      {/* 🔹 Animated Hacker Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px] animate-[scan_8s_linear_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_30px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 🔹 Logo */}
          <div
            onClick={(e) => handleScroll(e, '#home')}
            className="cursor-pointer text-xl md:text-2xl font-bold tracking-widest text-cyan-400 glitch"
            data-text="Md Taju"
          >
            Md Taju
          </div>

          {/* 🔹 Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.to}
                onClick={(e) => handleScroll(e, link.to)}
                className="relative text-sm uppercase tracking-wider text-gray-300 hover:text-cyan-400 transition-all duration-300"
                style={{ transform: `translateY(${i % 2 === 0 ? '-3px' : '3px'})` }}
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all duration-300 hover:w-full"></span>
              </a>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition"
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          {/* 🔹 Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-cyan-400"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* 🔹 Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-cyan-400/20">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.to}
              onClick={(e) => handleScroll(e, link.to)}
              className="block px-6 py-3 text-gray-300 hover:text-cyan-400 border-b border-cyan-400/10"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              toggleTheme();
              setIsOpen(false);
            }}
            className="w-full text-left px-6 py-3 text-cyan-400"
          >
            Toggle Theme
          </button>
        </div>
      )}

      {/* 🔹 Custom Animations */}
      <style>
        {`
        @keyframes scan {
          from { background-position: 0 0; }
          to { background-position: 200px 0; }
        }

        .glitch {
          position: relative;
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          width: 100%;
          overflow: hidden;
          color: #0aebcdff;
        }

        .glitch::before {
          top: -1px;
          text-shadow: -2px 0 #0ff;
          animation: glitchTop 2s infinite linear alternate-reverse;
        }

        .glitch::after {
          top: 1px;
          text-shadow: -2px 0 #00f;
          animation: glitchBottom 2.5s infinite linear alternate-reverse;
        }

        @keyframes glitchTop {
          0% { clip-path: inset(0 0 80% 0); }
          100% { clip-path: inset(0 0 10% 0); }
        }

        @keyframes glitchBottom {
          0% { clip-path: inset(80% 0 0 0); }
          100% { clip-path: inset(10% 0 0 0); }
        }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
