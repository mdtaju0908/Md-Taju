import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaLink } from 'react-icons/fa';

const ShareButtons = ({ title, url, description }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    alert('Blog link copied to clipboard!');
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const shareButtons = [
    { icon: FaFacebook, label: 'Facebook', link: shareLinks.facebook, color: 'hover:text-blue-600' },
    { icon: FaTwitter, label: 'Twitter', link: shareLinks.twitter, color: 'hover:text-blue-400' },
    { icon: FaLinkedin, label: 'LinkedIn', link: shareLinks.linkedin, color: 'hover:text-blue-700' },
    { icon: FaWhatsapp, label: 'WhatsApp', link: shareLinks.whatsapp, color: 'hover:text-green-500' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 my-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share This Post</h3>
      <div className="flex flex-wrap gap-4">
        {shareButtons.map((button) => {
          const Icon = button.icon;
          return (
            <a
              key={button.label}
              href={button.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 transition-all ${button.color}`}
              title={`Share on ${button.label}`}
            >
              <Icon size={20} />
              <span className="hidden sm:inline text-sm font-medium">{button.label}</span>
            </a>
          );
        })}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 transition-all hover:text-gray-900"
          title="Copy link to clipboard"
        >
          <FaLink size={20} />
          <span className="hidden sm:inline text-sm font-medium">Copy Link</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
