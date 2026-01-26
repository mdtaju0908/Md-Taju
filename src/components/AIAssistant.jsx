import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaStop, FaVolumeUp, FaVolumeMute, FaPaperPlane } from 'react-icons/fa';
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
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);
  const [lastLang, setLastLang] = useState('en');

  const detectLanguage = (text) => {
    const t = String(text || '');
    if (/[\u0900-\u097F]/.test(t)) return 'hi';
    return /\b(kya|kyu|kyun|kaise|acha|bahut|nahi|haan|hoon|hun|tha|hoga|kar|hai|the|thi)\b/i.test(t) ? 'hinglish' : 'en';
  };

  // Initialize Voices
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

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Default to Indian English
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput('');
          setTimeout(() => send(transcript), 300);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const speak = (text, lang) => {
    if (!voiceOn || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/[*#]/g, ''); 

    const u = new SpeechSynthesisUtterance(cleanText);
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1;

    let preferred;
    if (lang === 'hi') {
      u.lang = 'hi-IN';
      preferred =
        voices.find(v => /hi-IN/i.test(v.lang)) ||
        voices.find(v => /Hindi|हिंदी/i.test(v.name)) ||
        voices.find(v => v.name.includes('Google') && /hi/i.test(v.lang));
    } else {
      u.lang = 'en-IN';
      preferred =
        voices.find(v => v.name.includes('Google') && v.lang.includes('en-IN')) ||
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
        voices.find(v => v.lang.startsWith('en'));
    }

    if (preferred) u.voice = preferred;
    
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!open || isListening) return;
      const t = e.target;
      if (panelRef.current && panelRef.current.contains(t)) return;
      if (toggleRef.current && toggleRef.current.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open, isListening]);

  useEffect(() => {
    if (open && !welcomed) {
      const welcomeMsg = "Welcome to Md Taju Portfolio. I can tell you about his skills, projects, experience, or education. What would you like to know?";
      setMessages(prev => [...prev, { role: 'assistant', content: welcomeMsg }]);
      setWelcomed(true);
      // Small delay to ensure voices are loaded
      setTimeout(() => speak(welcomeMsg), 500);
    }
  }, [open, welcomed]); // Removed voices dependency to avoid loop, handled by timeout/voiceOn check

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const send = async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text) return;
    setInput('');
    const lang = detectLanguage(text);
    setLastLang(lang);
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    
    try {
      const { data } = await api.post('/ai/chat', { message: text });
      const reply = data.reply;
      const langServer = data.lang || lastLang || 'en';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      speak(reply, langServer);
    } catch (err) {
      const msg = "Sorry, the AI is busy right now. I can still share skills, projects, or education from the portfolio.";
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <>
      <motion.button
        onClick={() => setOpen(v => !v)}
        ref={toggleRef}
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed left-4 bottom-20 z-40 flex items-center gap-3 px-4 py-3 rounded-full border border-cyan-400/40 bg-black/60 backdrop-blur text-cyan-300 hover:bg-black/80 shadow-lg hover:shadow-cyan-400/20 transition-all"
        aria-label="Open AI Assistant"
      >
        <span className="relative w-8 h-8 rounded-full overflow-hidden ai-avatar">
          <span className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600"></span>
          <span className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), transparent 40%)' }}></span>
          <span className="ai-eye ai-eye-left"></span>
          <span className="ai-eye ai-eye-right"></span>
        </span>
        <span className="text-sm font-semibold hidden sm:inline">AI Assistant</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-4 z-50 w-[90vw] sm:w-[380px] bg-white dark:bg-gray-900 border border-cyan-400/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-900 to-black text-cyan-300 border-b border-cyan-400/20">
              <div className="flex items-center gap-3">
                <span className="relative w-8 h-8 rounded-full overflow-hidden ai-avatar ring-1 ring-cyan-400/50">
                  <span className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600"></span>
                  <span className="absolute inset-0 opacity-60 mix-blend-overlay"></span>
                  <span className="ai-eye ai-eye-left"></span>
                  <span className="ai-eye ai-eye-right"></span>
                </span>
                <div>
                  <h3 className="font-bold text-sm leading-tight">AI Assistant</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !voiceOn;
                    setVoiceOn(next);
                    if (!next) window.speechSynthesis.cancel();
                  }}
                  className={`p-2 rounded-full transition-colors ${voiceOn ? 'bg-cyan-400/20 text-cyan-300' : 'bg-gray-800 text-gray-500'}`}
                  title={voiceOn ? "Mute Voice" : "Enable Voice"}
                >
                  {voiceOn ? <FaVolumeUp size={14} /> : <FaVolumeMute size={14} />}
                </button>
                <button 
                  onClick={() => setOpen(false)} 
                  className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50/50 dark:bg-black/20">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-700 flex gap-1 items-center">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              {isListening && (
                 <div className="text-xs text-center text-cyan-500 mb-2 animate-pulse font-medium">
                   Listening... Speak now
                 </div>
              )}
              <div className="flex gap-2 items-center">
                <button
                  onClick={toggleListening}
                  className={`p-3 rounded-full transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-red-500/50 shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <FaStop size={16} /> : <FaMicrophone size={16} />}
                </button>
                
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isListening ? send() : null}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
                
                <button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-600/20"
                >
                  <FaPaperPlane size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
