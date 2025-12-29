import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaYoutube
} from 'react-icons/fa';
import api from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await api.post('/messages/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 5000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* LEFT INFO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              I'm always open to discussing new projects, creative ideas or opportunities.
            </p>

            <a
              href="mailto:info@mdtaju.tech"
              className="flex items-center text-gray-700 dark:text-gray-300 mb-8"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-4">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
              <span className="text-lg">info@mdtaju.tech</span>
            </a>

            <div className="flex gap-4 mt-8">
              <a href="https://github.com/mdtaju0908" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/md-taju0908/" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition">
                <FaLinkedin />
              </a>
              <a href="https://x.com/md_taju0908/" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/md_taju0908/" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition">
                <FaInstagram />
              </a>
              <a href="https://www.facebook.com/md.taju0908/" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <FaFacebookF />
              </a>
              <a href="https://www.youtube.com/@md_taju0908/" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition">
                <FaYoutube />
              </a>
            </div>
          </motion.div>

          {/* RIGHT FORM – WATER WAVE BACKGROUND */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
          >

            {/* 🌊 WATER WAVE BACKGROUND */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')"
              }}
            />

            {/* overlay for readability */}
            <div className="absolute inset-0 bg-white/70 dark:bg-black/50 backdrop-blur-md"></div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="relative p-10 space-y-6">

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-white/60 dark:text-white focus:outline-none"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-white/60 dark:text-white focus:outline-none"
              />

              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Your message..."
                className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-white/60 dark:text-white focus:outline-none"
              />

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="text-green-600 text-center">
                  Message sent successfully!
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-600 text-center">
                  Failed to send message.
                </p>
              )}

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
