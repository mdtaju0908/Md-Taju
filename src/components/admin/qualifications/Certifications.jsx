import React, { useState, useEffect } from 'react';
import api, { unwrapList } from '@/utils/api';
import { format } from 'date-fns';

const CertificationsManager = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    credentialID: '',
    credentialURL: '',
    logo: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const res = await api.get('/certifications');
      setCertifications(unwrapList(res, 'data'));
    } catch (error) {
      console.error("Error fetching certifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/certifications/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/certifications', formData);
      }
      setFormData({
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialID: '',
        credentialURL: '',
        logo: ''
      });
      fetchCertifications();
    } catch (error) {
      console.error("Error saving certification:", error);
      alert("Failed to save certification");
    }
  };

  const handleEdit = (cert) => {
    setEditingId(cert._id);
    setFormData({
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
      expirationDate: cert.expirationDate ? cert.expirationDate.split('T')[0] : '',
      credentialID: cert.credentialID || '',
      credentialURL: cert.credentialURL || '',
      logo: cert.logo || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await api.delete(`/certifications/${id}`);
        fetchCertifications();
      } catch (error) {
        console.error("Error deleting certification:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Manage Certifications</h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit Certification' : 'Add New Certification'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Certification Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="issuingOrganization"
              placeholder="Issuing Organization"
              value={formData.issuingOrganization}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="credentialID"
              placeholder="Credential ID"
              value={formData.credentialID}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
             <input
              type="text"
              name="credentialURL"
              placeholder="Credential URL"
              value={formData.credentialURL}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          
           <input
              type="text"
              name="logo"
              placeholder="Logo URL"
              value={formData.logo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Issue Date</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Expiration Date (Optional)</label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              {editingId ? 'Update Certification' : 'Add Certification'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    issuingOrganization: '',
                    issueDate: '',
                    expirationDate: '',
                    credentialID: '',
                    credentialURL: '',
                    logo: ''
                  });
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white rounded-lg font-semibold transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (Array.isArray(certifications) ? certifications : []).map((cert) => (
          <div key={cert._id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex justify-between items-start">
            <div>
              <h4 className="text-xl font-bold">{cert.name}</h4>
              <p className="text-blue-600 dark:text-blue-400">{cert.issuingOrganization}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Issued {format(new Date(cert.issueDate), 'MMM yyyy')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(cert)}
                className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cert._id)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {certifications.length === 0 && !loading && (
          <p className="text-gray-400">No certifications found.</p>
        )}
      </div>
    </div>
  );
};

export default CertificationsManager;
