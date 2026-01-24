import React, { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

const Feedback = () => {
  const [brand, setBrand] = useState({ name: 'Md Taju', website: 'https://mdtaju.tech/' });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState('');
  const pageName = useMemo(() => 'mdtaju.tech Feedback Page', []);
  const [source, setSource] = useState('direct');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/config/brand');
        setBrand({
          name: data?.name || 'Md Taju',
          website: data?.website || 'https://mdtaju.tech/',
        });
      } catch {}
    })();
  }, []);

  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const src = sp.get('source');
      if (src) setSource(src);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem('feedback_submitted') === 'true') {
        setSubmitted(true);
      }
    } catch {}
  }, []);

  const submitFeedback = async () => {
    if (!rating || submitted) return;
    const payload = {
      access_key: 'b01377e3-91b3-4e34-805c-e4f737a8bb49',
      rating: String(rating),
      message,
      page: pageName,
      source,
      website: brand.website,
      subject: `⭐ New Portfolio Feedback – ${brand.name}`,
      sender_name: brand.name,
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
        localStorage.setItem('feedback_submitted', 'true');
        setToast('Thank you for your feedback! ⭐');
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
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Rate Your Experience with {brand.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Your feedback helps me improve.
        </p>
        {source === 'email' && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
            Thanks for coming from email 😊
          </p>
        )}

        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
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

        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitted}
          placeholder="Optional message..."
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 mb-4"
        />

        <button
          type="button"
          onClick={submitFeedback}
          disabled={!rating || submitted}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          Submit Feedback
        </button>

        {toast && (
          <div className="mt-4 px-3 py-2 rounded bg-green-100 text-green-700 text-sm">
            {toast}
          </div>
        )}

        {submitted && (
          <p className="mt-3 text-center text-gray-600 dark:text-gray-300">
            Form disabled to prevent duplicate submissions.
          </p>
        )}
      </div>
    </section>
  );
};

export default Feedback;
