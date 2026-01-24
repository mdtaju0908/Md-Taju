import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const CertificationsManager = () => {
  const [certifications, setCertifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCertification, setCurrentCertification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    credentialID: '',
    credentialURL: '',
    logo: ''
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const { data } = await api.get('/certifications');
      setCertifications(data);
      setFetchLoading(false);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      setMessage({ type: 'error', text: 'Failed to fetch certifications.' });
      setFetchLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await api.delete(`/certifications/${id}`);
        setCertifications(certifications.filter(cert => cert._id !== id));
        setMessage({ type: 'success', text: 'Certification deleted successfully' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Error deleting certification:', error);
        setMessage({ type: 'error', text: 'Failed to delete certification' });
      }
    }
  };

  const handleEdit = (cert) => {
    setIsEditing(true);
    setCurrentCertification(cert);
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
    setMessage({ type: '', text: '' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentCertification(null);
    setFormData({
      name: '',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      credentialID: '',
      credentialURL: '',
      logo: ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.name || !formData.issuingOrganization || !formData.issueDate) {
      setMessage({ type: 'error', text: 'Please fill in all required fields (Name, Organization, Issue Date)' });
      setLoading(false);
      return;
    }

    try {
      if (currentCertification) {
        await api.put(`/certifications/${currentCertification._id}`, formData);
        setMessage({ type: 'success', text: 'Certification updated successfully' });
      } else {
        await api.post('/certifications', formData);
        setMessage({ type: 'success', text: 'Certification added successfully' });
      }

      fetchCertifications();
      resetForm();
    } catch (error) {
      console.error("Save failed:", error);
      const errorMsg = error.response?.data?.message || "Certification save FAILED";
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Certifications</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <FaPlus className="mr-2" /> Add New
          </button>
        )}
      </div>

      {message.text && (
        <div className={`p-4 rounded-md mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {isEditing && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              {currentCertification ? 'Edit Certification' : 'Add New Certification'}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Issuing Organization *</label>
                <input
                  type="text"
                  value={formData.issuingOrganization}
                  onChange={e => setFormData({ ...formData, issuingOrganization: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Organization Logo URL</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={e => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Issue Date *</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={e => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Credential ID</label>
                <input
                  type="text"
                  value={formData.credentialID}
                  onChange={e => setFormData({ ...formData, credentialID: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Credential URL</label>
                <input
                  type="text"
                  value={formData.credentialURL}
                  onChange={e => setFormData({ ...formData, credentialURL: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? 'Saving...' : <><FaSave className="mr-2" /> Save Certification</>}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {fetchLoading ? (
        <div className="text-center py-10">Loading certifications...</div>
      ) : (
        <div className="space-y-4">
          {certifications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">No certifications found. Add one above!</p>
          ) : (
            certifications.map((cert) => (
              <div key={cert._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{cert.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{cert.issuingOrganization}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Issued {new Date(cert.issueDate).toLocaleDateString()} 
                      {cert.expirationDate ? ` • Expires ${new Date(cert.expirationDate).toLocaleDateString()}` : ' • No Expiration'}
                    </p>
                    {cert.credentialID && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {cert.credentialID}</p>}
                    {cert.credentialURL && (
                      <a href={cert.credentialURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm mt-1 inline-block">
                        Show Credential
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(cert._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationsManager;
