import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api, { unwrapList } from '../utils/api';
import { FaExternalLinkAlt } from 'react-icons/fa';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await api.get('/certifications');
        setCertifications(unwrapList(res, 'data'));
      } catch (error) {
        console.error('Error fetching certifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <div className="text-center py-10">Loading certifications...</div>;
  }

  if (!Array.isArray(certifications) || certifications.length === 0) {
    return <div className="text-center py-10">No data available</div>;
  }

  return (
    <section id="certifications" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Licenses & Certifications</h2>
          <div className="w-20 h-1 bg-blue-600 rounded"></div>
        </motion.div>

        <div className="space-y-6">
          {(Array.isArray(certifications) ? certifications : []).map((cert, index) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-shrink-0">
                {cert.logo ? (
                  <img src={cert.logo} alt={cert.issuingOrganization} className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-md bg-gray-100" />
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-xl font-bold text-gray-500">
                    {cert.issuingOrganization.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{cert.name}</h3>
                <div className="text-base font-medium text-gray-800 dark:text-gray-200">{cert.issuingOrganization}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Issued {formatDate(cert.issueDate)}
                  {cert.expirationDate && ` • Expires ${formatDate(cert.expirationDate)}`}
                </div>
                {cert.credentialID && (
                   <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                     Credential ID {cert.credentialID}
                   </div>
                )}
                
                {cert.credentialURL && (
                  <div className="mt-3">
                    <a 
                      href={cert.credentialURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Show credential <FaExternalLinkAlt className="ml-2 text-xs" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
