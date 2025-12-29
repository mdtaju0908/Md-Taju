import React, { useState, useEffect } from 'react';
import api, { unwrapList } from '@/utils/api';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 'Intermediate'
  });
  const [editingId, setEditingId] = useState(null);

  const categories = ['Frontend', 'Backend', 'Tools', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(unwrapList(res, 'data'));
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/skills', formData);
      }
      setFormData({
        name: '',
        category: 'Frontend',
        level: 'Intermediate'
      });
      fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
      alert("Failed to save skill");
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/skills/${id}`);
        fetchSkills();
      } catch (error) {
        console.error("Error deleting skill:", error);
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
      <h2 className="text-3xl font-bold mb-8">Manage Skills</h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Skill Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            >
              {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              {editingId ? 'Update Skill' : 'Add Skill'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    category: 'Frontend',
                    level: 'Intermediate'
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (Array.isArray(skills) ? skills : []).map((skill) => (
          <div key={skill._id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex justify-between items-center">
            <div>
              <h4 className="font-bold">{skill.name}</h4>
              <p className="text-xs text-blue-600 dark:text-blue-400">{skill.category} • {skill.level}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(skill)}
                className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(skill._id)}
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
              >
                Del
              </button>
            </div>
          </div>
        ))}
        {skills.length === 0 && !loading && (
          <p className="text-gray-600 dark:text-gray-400 col-span-full">No skills found.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
