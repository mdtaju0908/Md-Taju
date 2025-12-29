import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { format } from 'date-fns';

const EducationManager = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data } = await api.get('/education');
      setEducation(data);
    } catch (error) {
      console.error("Error fetching education:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/education/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/education', formData);
      }
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
      fetchEducation();
    } catch (error) {
      console.error("Error saving education:", error);
      alert("Failed to save education");
    }
  };

  const handleEdit = (edu) => {
    setEditingId(edu._id);
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
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education?')) {
      try {
        await api.delete(`/education/${id}`);
        fetchEducation();
      } catch (error) {
        console.error("Error deleting education:", error);
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
      <h2 className="text-3xl font-bold mb-8">Manage Education</h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit Education' : 'Add New Education'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="school"
              placeholder="School / University"
              value={formData.school}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="degree"
              placeholder="Degree"
              value={formData.degree}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="fieldOfStudy"
              placeholder="Field of Study"
              value={formData.fieldOfStudy}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="grade"
              placeholder="Grade / CGPA"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">End Date (Leave empty if present)</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
           <input
              type="text"
              name="logo"
              placeholder="Logo URL"
              value={formData.logo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          ></textarea>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              {editingId ? 'Update Education' : 'Add Education'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
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
        ) : education.map((edu) => (
          <div key={edu._id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex justify-between items-start">
            <div>
              <h4 className="text-xl font-bold">{edu.school}</h4>
              <p className="text-blue-600 dark:text-blue-400">{edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {format(new Date(edu.startDate), 'yyyy')} - {edu.endDate ? format(new Date(edu.endDate), 'yyyy') : 'Present'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(edu)}
                className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(edu._id)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {education.length === 0 && !loading && (
          <p className="text-gray-400">No education found.</p>
        )}
      </div>
    </div>
  );
};

export default EducationManager;
