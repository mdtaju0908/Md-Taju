import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import FeedbackStars from './FeedbackStars';

const Footer = () => {
  const [brandName, setBrandName] = useState('Md Taju');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/config/brand');
        if (data?.name) setBrandName(data.name);
      } catch {}
    })();
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FeedbackStars />
        <p className="text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
