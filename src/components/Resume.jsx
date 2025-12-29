import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaFilePdf } from 'react-icons/fa';
import api from '../utils/api';

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data } = await api.get('/about');
        if (data) {
          const urlPrimary = data.resumeUrl;
          const urlLegacy = typeof data.resume === 'string' ? data.resume : data.resume?.url;
          const url = urlPrimary || urlLegacy;
          if (url) setResumeUrl(url);
        }
      } catch (error) {
        console.error('Error fetching resume url:', error);
      }
    };
    fetchResume();
  }, []);

  return (
    <section id="resume" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Resume</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Check out my resume to see my full professional background, education, and skills.
          </p>
          
          <a
            href={resumeUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform hover:-translate-y-1"
          >
            <FaFilePdf className="mr-3 text-xl" />
            Download / View Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
