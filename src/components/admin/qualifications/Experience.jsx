import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { format } from 'date-fns';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    skills: '',
    logo: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data } = await api.get('/experiences');
      setExperiences(data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/experiences/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/experiences', formData);
      }
      setFormData({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        skills: '',
        logo: ''
      });
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
      alert("Failed to save experience");
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      isCurrent: exp.isCurrent,
      description: exp.description || '',
      skills: exp.skills ? exp.skills.join(', ') : '',
      logo: exp.logo || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await api.delete(`/experiences/${id}`);
        fetchExperiences();
      } catch (error) {
        console.error("Error deleting experience:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Manage Experience</h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit Experience' : 'Add New Experience'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="location"
              placeholder="Location (e.g. Remote, NY)"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="logo"
              placeholder="Logo URL"
              value={formData.logo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.isCurrent}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isCurrent"
                  checked={formData.isCurrent}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span>I currently work here</span>
              </label>
            </div>
          </div>

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          ></textarea>

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated, e.g. React, Node.js)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              {editingId ? 'Update Experience' : 'Add Experience'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    isCurrent: false,
                    description: '',
                    skills: '',
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
        ) : experiences.map((exp) => (
          <div key={exp._id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex justify-between items-start">
            <div>
              <h4 className="text-xl font-bold">{exp.title}</h4>
              <p className="text-blue-600 dark:text-blue-400">{exp.company}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {format(new Date(exp.startDate), 'MMM yyyy')} - {exp.isCurrent ? 'Present' : (exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : '')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(exp)}
                className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp._id)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {experiences.length === 0 && !loading && (
          <p className="text-gray-400">No experiences found.</p>
        )}
      </div>
    </div>
  );
};

export default ExperienceManager;
