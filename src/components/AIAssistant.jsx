import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const [welcomed, setWelcomed] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [hasSpoken, setHasSpoken] = useState(false);
  const welcomeText = 'Welcome to Md Taju Portfolio';
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices() || [];
      setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!open) return;
      const t = e.target;
      if (panelRef.current && panelRef.current.contains(t)) return;
      if (toggleRef.current && toggleRef.current.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  useEffect(() => {
    if (open && !welcomed) {
      setMessages(prev => [...prev, { role: 'assistant', content: welcomeText }]);
      setWelcomed(true);
    }
  }, [open, welcomed]);

  useEffect(() => {
    if (open && welcomed && voiceOn && !hasSpoken) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(welcomeText);
        u.lang = 'hi-IN';
        u.rate = 1.0;
        u.pitch = 1.0;
        u.volume = 1;
        const preferred =
          voices.find(v => (v.lang || '').toLowerCase().startsWith('hi')) ||
          voices.find(v => /hindi|हिंदी/i.test(v.name)) ||
          voices.find(v => (v.lang || '').toLowerCase().includes('en-in')) ||
          voices.find(v => (v.lang || '').toLowerCase().startsWith('en'));
        if (preferred) u.voice = preferred;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
        setHasSpoken(true);
      }
    }
  }, [open, welcomed, voiceOn, hasSpoken, voices]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: text });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      const msg = err?.response?.data?.reply || err?.response?.data?.message || 'Sorry, I had trouble answering that.';
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(v => !v)}
        ref={toggleRef}
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed left-4 bottom-20 z-40 flex items-center gap-3 px-4 py-3 rounded-full border border-cyan-400/40 bg-black/60 backdrop-blur text-cyan-300 hover:bg-black/80"
        aria-label="Open AI Assistant"
      >
        <span className="relative w-8 h-8 rounded-full overflow-hidden ai-avatar">
          <span className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600"></span>
          <span className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), transparent 40%)' }}></span>
          <span className="ai-eye ai-eye-left"></span>
          <span className="ai-eye ai-eye-right"></span>
        </span>
        <span className="text-sm font-semibold">AI Assistant</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-4 z-50 w-[94vw] sm:w-[380px] bg-white dark:bg-gray-900 border border-cyan-400/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-black/70 text-cyan-300">
              <div className="flex items-center gap-3">
                <span className="relative w-8 h-8 rounded-full overflow-hidden ai-avatar">
                  <span className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600"></span>
                  <span className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.7), transparent 45%)' }}></span>
                  <span className="ai-eye ai-eye-left"></span>
                  <span className="ai-eye ai-eye-right"></span>
                </span>
                <span className="font-semibold">AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !voiceOn;
                    setVoiceOn(next);
                    if (!next && typeof window !== 'undefined' && window.speechSynthesis) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className="px-2 py-1 rounded border border-cyan-400/40 text-cyan-300 hover:bg-black/40"
                >
                  {voiceOn ? '🔊 Voice On' : '🔇 Voice Off'}
                </button>
                <button onClick={() => setOpen(false)} className="text-cyan-300">Close</button>
              </div>
            </div>

            <div className="p-3 space-y-2 max-h-[55vh] overflow-y-auto">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 rounded-xl text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-cyan-400/20 bg-white/80 dark:bg-gray-900/80">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' ? send() : null}
                  placeholder="Ask about, skills, projects, resume..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={send}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
