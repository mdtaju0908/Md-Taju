import React from 'react';
import { format } from 'date-fns';

const ExperienceCard = ({ experience }) => {
  const safeDate = (d, fmt) => {
    if (!d) return '';
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? '' : format(parsed, fmt);
  };
  const skills = Array.isArray(experience?.skills) ? experience.skills : [];
  return (
    <div className="
      flex flex-col md:flex-row gap-4 p-6
      bg-white dark:bg-[#111827]
      border border-gray-200 dark:border-gray-700
      rounded-xl hover:border-blue-500/50 transition-colors duration-300
    ">
      {experience.logo && (
        <div className="flex-shrink-0">
          <img
            src={experience.logo}
            alt={`${experience.company} Logo`}
            className="w-16 h-16 object-contain rounded-lg bg-gray-100 dark:bg-white/5 p-1"
          />
        </div>
      )}

      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {experience.title}
        </h3>

        <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
          {experience.company}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>
            {safeDate(experience.startDate, 'MMM yyyy')} –{' '}
            {experience.isCurrent
              ? 'Present'
              : experience.endDate
              ? safeDate(experience.endDate, 'MMM yyyy')
              : ''}
          </span>

          {experience.location && (
            <span>{experience.location}</span>
          )}
        </div>

        {experience.description && (
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
            {experience.description}
          </p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="
                  px-3 py-1 text-xs font-medium rounded-full
                  text-blue-700 dark:text-blue-300
                  bg-blue-100 dark:bg-blue-900/20
                  border border-blue-200 dark:border-blue-800/50
                "
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceCard;
