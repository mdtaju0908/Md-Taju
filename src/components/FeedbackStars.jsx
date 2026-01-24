import React, { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

const FeedbackStars = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState('');
  const [brandName, setBrandName] = useState('Md Taju');
  const pageName = useMemo(() => 'mdtaju.tech Portfolio Feedback', []);
  const [website, setWebsite] = useState('https://mdtaju.tech/');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/config/brand');
        if (data?.name) setBrandName(data.name);
        if (data?.website) setWebsite(data.website);
      } catch {}
    })();
  }, []);
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const r = Number(sp.get('rating'));
      if (r >= 1 && r <= 5 && !submitted) {
        setRating(r);
        setTimeout(() => submitFeedback(), 0);
      }
    } catch {}
  }, [submitted]);

  const submitFeedback = async () => {
    if (!rating || submitted) return;
    const form = document.getElementById('fbForm');
    if (!form) return;
    const payload = {
      access_key: 'b01377e3-91b3-4e34-805c-e4f737a8bb49',
      rating: String(rating),
      page: pageName,
      website,
      subject: `⭐ New Portfolio Feedback – ${brandName}`,
      sender_name: brandName,
      datetime: new Date().toLocaleString(),
    };
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setToast('Thanks for your feedback!');
        setTimeout(() => setToast(''), 3000);
      } else {
        setToast('Submission failed. Please try again.');
        setTimeout(() => setToast(''), 3000);
      }
    } catch {
      setToast('Network error. Please try again.');
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <form id="fbForm" action="https://api.web3forms.com/submit" method="POST" className="hidden">
        <input type="hidden" name="access_key" value="b01377e3-91b3-4e34-805c-e4f737a8bb49" />
        <input type="hidden" name="rating" id="rating_value" value={rating || ''} readOnly />
        <input type="hidden" name="page" value={pageName} />
        <input type="hidden" name="website" value={website} />
        <input type="hidden" name="sender_name" value={brandName} />
      </form>
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`Rate ${i} star${i>1?'s':''}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => !submitted && setRating(i)}
            disabled={submitted}
            className={[
              'text-3xl transition-transform duration-200',
              (hover >= i || rating >= i) ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-500',
              submitted ? 'cursor-not-allowed opacity-70' : 'hover:scale-110',
            ].join(' ')}
          >
            ★
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submitFeedback}
          disabled={!rating || submitted}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Submit
        </button>
        {toast && (
          <div className="px-3 py-2 rounded bg-green-100 text-green-700 text-sm">
            {toast}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Tap a star to rate
      </p>
    </div>
  );
};

export default FeedbackStars;
