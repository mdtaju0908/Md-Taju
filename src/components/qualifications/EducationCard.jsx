import React from 'react';
import { format } from 'date-fns';

const EducationCard = ({ education }) => {
  return (
    <div className="
      flex flex-col md:flex-row gap-4 p-6
      bg-white dark:bg-[#111827]
      border border-gray-200 dark:border-gray-700
      rounded-xl hover:border-blue-500/50 transition-colors duration-300
    ">
      {education.logo && (
        <div className="flex-shrink-0">
          <img
            src={education.logo}
            alt={`${education.school} Logo`}
            className="w-16 h-16 object-contain rounded-lg bg-gray-100 dark:bg-white/5 p-1"
          />
        </div>
      )}

      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {education.school}
        </h3>

        <p className="text-lg text-gray-700 dark:text-gray-200 font-medium mb-1">
          {education.degree}
          {education.fieldOfStudy ? ` in ${education.fieldOfStudy}` : ''}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span>
            {format(new Date(education.startDate), 'yyyy')} –{' '}
            {education.endDate
              ? format(new Date(education.endDate), 'yyyy')
              : 'Present'}
          </span>

          {education.grade && (
            <span>Grade: {education.grade}</span>
          )}
        </div>

        {education.description && (
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {education.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default EducationCard;
