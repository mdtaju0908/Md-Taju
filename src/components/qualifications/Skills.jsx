import React, { useEffect, useState } from 'react';
import api, { unwrapList } from '@/utils/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills');
        setSkills(unwrapList(res, 'data'));
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) return <div className="text-center text-gray-500 dark:text-gray-400">Loading skills...</div>;
  if (!Array.isArray(skills) || skills.length === 0) return <div className="text-center text-gray-500 dark:text-gray-400">No data available</div>;

  const groupedSkills = (Array.isArray(skills) ? skills : []).reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Technical Skills
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div
            key={category}
            className="
              bg-white dark:bg-[#111827]
              p-6 rounded-xl border
              border-gray-200 dark:border-gray-800
              hover:border-blue-500/30 transition-all duration-300
            "
          >
            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
              {category}
            </h4>

            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <div
                  key={skill._id}
                  className="
                    px-3 py-1.5 rounded-lg text-sm
                    bg-gray-100 dark:bg-gray-800/50
                    text-gray-800 dark:text-gray-300
                    border border-gray-300 dark:border-gray-700
                    hover:bg-gray-200 dark:hover:bg-gray-800
                    transition-colors
                  "
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
