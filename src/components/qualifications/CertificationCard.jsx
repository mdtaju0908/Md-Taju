import React from 'react';
import { format } from 'date-fns';

const CertificationCard = ({ certification }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      {certification.logo && (
        <div className="flex-shrink-0">
          <img
            src={certification.logo}
            alt={`${certification.issuingOrganization} Logo`}
            className="w-16 h-16 object-contain rounded-lg bg-gray-100 dark:bg-gray-700 p-1 border border-gray-200 dark:border-gray-700"
          />
        </div>
      )}

      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {certification.name}
        </h3>

        <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
          {certification.issuingOrganization}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            Issued {format(new Date(certification.issueDate), 'MMM yyyy')}
            {certification.expirationDate &&
              ` · Expires ${format(new Date(certification.expirationDate), 'MMM yyyy')}`}
          </span>
          {certification.credentialID && (
            <span className="text-gray-500 dark:text-gray-400">Credential ID: {certification.credentialID}</span>
          )}
        </div>

        {certification.credentialURL && (
          <a
            href={certification.credentialURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Show Credential
          </a>
        )}
      </div>
    </div>
  );
};

export default CertificationCard;
