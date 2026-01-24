import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const EducationManager = () => {
  const [education, setEducation] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEducation, setCurrentEducation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
    description: '',
    logo: ''
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data } = await api.get('/education');
      setEducation(data);
      setFetchLoading(false);
    } catch (error) {
      console.error('Error fetching education:', error);
      setMessage({ type: 'error', text: 'Failed to fetch education data.' });
      setFetchLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education?')) {
      try {
        await api.delete(`/education/${id}`);
        setEducation(education.filter(edu => edu._id !== id));
        setMessage({ type: 'success', text: 'Education deleted successfully' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Error deleting education:', error);
        setMessage({ type: 'error', text: 'Failed to delete education' });
      }
    }
  };

  const handleEdit = (edu) => {
    setIsEditing(true);
    setCurrentEducation(edu);
    setFormData({
      school: edu.school,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
      endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
      grade: edu.grade || '',
      description: edu.description || '',
      logo: edu.logo || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMessage({ type: '', text: '' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentEducation(null);
    setFormData({
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
      logo: ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.school || !formData.degree || !formData.startDate) {
      setMessage({ type: 'error', text: 'Please fill in all required fields (School, Degree, Start Date)' });
      setLoading(false);
      return;
    }

    try {
      if (currentEducation) {
        await api.put(`/education/${currentEducation._id}`, formData);
        setMessage({ type: 'success', text: 'Education updated successfully' });
      } else {
        await api.post('/education', formData);
        setMessage({ type: 'success', text: 'Education added successfully' });
      }

      fetchEducation();
      resetForm();
    } catch (error) {
      console.error("Save failed:", error);
      const errorMsg = error.response?.data?.message || "Education save FAILED";
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Education</h2>
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
              {currentEducation ? 'Edit Education' : 'Add New Education'}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">School *</label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={e => setFormData({ ...formData, school: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Degree *</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={e => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Field of Study</label>
                <input
                  type="text"
                  value={formData.fieldOfStudy}
                  onChange={e => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">School Logo URL</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={e => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Grade</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={e => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                rows="4"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? 'Saving...' : <><FaSave className="mr-2" /> Save Education</>}
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
        <div className="text-center py-10">Loading education...</div>
      ) : (
        <div className="space-y-4">
          {education.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">No education found. Add one above!</p>
          ) : (
            education.map((edu) => (
              <div key={edu._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{edu.school}</h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    {edu.grade && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Grade: {edu.grade}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(edu)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(edu._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {edu.description && <p className="mt-3 text-gray-700 dark:text-gray-300 whitespace-pre-line">{edu.description}</p>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EducationManager;
