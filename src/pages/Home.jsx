import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Qualifications from '../components/Qualifications';
import Gallery from '../components/Gallery';
import Resume from '../components/Resume';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const pathToId = {
      '/about': '#about',
      '/projects': '#projects',
      '/gallery': '#gallery',
      '/resume': '#resume',
      '/contact': '#contact'
    };
    const targetId = location.hash || pathToId[location.pathname];
    if (targetId) {
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <Hero />
      <About />
      <Qualifications />
      <Projects />
      <Gallery />
      <Resume />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
