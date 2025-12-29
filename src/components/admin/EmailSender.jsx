// DB is not used anywhere
import React, { useMemo, useRef, useState } from "react";
import api from "../../utils/api";
import { FaPaperPlane } from "react-icons/fa";

const EmailSender = () => {
  const [form, setForm] = useState({ to: "", subject: "", recipientName: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);
  const editorRef = useRef(null);
  const [messageHtml, setMessageHtml] = useState("");
  const [contentAlign, setContentAlign] = useState("left");
  const [lineHeight, setLineHeight] = useState("1.6");
  const [brand, setBrand] = useState({
    name: "Md Taju",
    title: "Full-Stack Developer & AI Engineer",
    photoUrl: "https://mdtaju.tech/images/profile-photo.jpg",
    ctaUrl: "https://mdtaju.tech",
    feedbackUrl: "https://mdtaju.tech/feedback",
    domain: "mdtaju.tech",
    socials: {
      instagram: "https://www.instagram.com/md_taju0908/",
      facebook: "https://www.facebook.com/md.taju0908/",
      youtube: "https://www.youtube.com/@mdtaju0908",
      github: "https://github.com/mdtaju0908",
      linkedin: "https://www.linkedin.com/in/md-taju0908/"
    }
  });

  // static brand; no auth or DB fetch

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
  };

  const plainTextFromHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return (tmp.textContent || tmp.innerText || "").trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (!validateEmail(form.to)) {
      setStatus({ type: "error", text: "Please enter a valid recipient email." });
      return;
    }
    if (!form.subject.trim() || !plainTextFromHtml(messageHtml)) {
      setStatus({ type: "error", text: "Subject and message cannot be empty." });
      return;
    }

    setSending(true);
    try {
      const { data } = await api.post("/email/send", {
        to: form.to.trim(),
        subject: form.subject.trim(),
        message: messageHtml,
        recipientName: form.recipientName.trim(),
      });
      setStatus({ type: "success", text: data.message || "Email sent successfully." });
      setForm({ to: "", subject: "", recipientName: "" });
      if (editorRef.current) editorRef.current.innerHTML = "";
      setMessageHtml("");
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to send email.";
      setStatus({ type: "error", text: msg });
    } finally {
      setSending(false);
    }
  };

  const sanitizeHtml = (html = "") => {
    const container = document.createElement("div");
    container.innerHTML = String(html);
    const scrub = (node) => {
      if (node.nodeType !== 1) return;
      const tag = node.tagName.toLowerCase();
      if (tag === "script") {
        node.remove();
        return;
      }
      Array.from(node.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value || "";
        if (name.startsWith("on")) {
          node.removeAttribute(attr.name);
        }
        if ((name === "href" || name === "src") && value.trim().toLowerCase().startsWith("javascript:")) {
          node.setAttribute(name, "#");
        }
      });
      Array.from(node.childNodes).forEach(scrub);
    };
    Array.from(container.childNodes).forEach(scrub);
    return container.innerHTML;
  };

  const escapeHtml = (str = "") => {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const buildTemplate = ({ recipient, subject, message, brand }) => {
    const raw = String(brand.feedbackUrl || '').trim().replace(/\/+$/, '');
    const withPath = raw
      ? (raw.includes('/feedback') ? raw : raw + '/feedback')
      : 'https://mdtaju.tech/feedback';
    const feedbackHref = withPath + (withPath.includes('?') ? '&source=email' : '?source=email');
    const socialLinksHtml = [
      brand.socials.instagram && `<a href="${brand.socials.instagram}" style="margin:0 8px;"><img alt="Instagram" src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" style="filter: invert(20%);"/></a>`,
      brand.socials.facebook && `<a href="${brand.socials.facebook}" style="margin:0 8px;"><img alt="Facebook" src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="20" height="20" style="filter: invert(20%);"/></a>`,
      brand.socials.youtube && `<a href="${brand.socials.youtube}" style="margin:0 8px;"><img alt="YouTube" src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="20" height="20" style="filter: invert(20%);"/></a>`,
      brand.socials.github && `<a href="${brand.socials.github}" style="margin:0 8px;"><img alt="GitHub" src="https://cdn-icons-png.flaticon.com/512/2111/2111432.png" width="20" height="20" style="filter: invert(20%);"/></a>`,
      brand.socials.linkedin && `<a href="${brand.socials.linkedin}" style="margin:0 8px;"><img alt="LinkedIn" src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="20" height="20" style="filter: invert(20%);"/></a>`
    ].filter(Boolean).join("");
    const safeMessage = sanitizeHtml(message || "");
    return `
      <div style="background:#f5f7fb;padding:24px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:32px;background:linear-gradient(135deg,#4f46e5,#06b6d4);text-align:center;color:#fff;">
              <img src="${brand.photoUrl}" alt="${escapeHtml(brand.name)}" width="88" height="88" style="border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.5);"/>
              <h1 style="margin:16px 0 4px;font-size:24px;line-height:28px;">${escapeHtml(brand.name)}</h1>
              <p style="margin:0;opacity:0.9;">${escapeHtml(brand.title)}</p>
              <a href="${brand.ctaUrl}" style="display:inline-block;margin-top:16px;padding:10px 16px;background:#22c55e;color:#0b3418;text-decoration:none;border-radius:999px;font-weight:600;">Visit Portfolio</a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;">
              <p style="color:#111827;font-size:16px;line-height:24px;margin:0 0 12px;">Dear ${escapeHtml(recipient.name || 'Recipient')},</p>
              <p style="color:#374151;font-size:14px;line-height:22px;margin:0 0 16px;">I hope you are doing well.</p>
              <div style="padding:16px 20px;background:#eef2ff;border:1px solid #e0e7ff;border-radius:12px;color:#1f2937;font-size:14px;line-height:22px;">
                ${safeMessage}
              </div>
              <p style="color:#374151;font-size:14px;line-height:22px;margin:16px 0 8px;">Regards,</p>
              <p style="color:#111827;font-weight:700;margin:0;">${escapeHtml(brand.name)}</p>
              <p style="color:#6b7280;margin:0;">${escapeHtml(brand.title)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;">
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;text-align:center;">
                <p style="margin:0 0 8px;color:#111827;font-weight:600;">Rate Your Experience</p>
                <p style="margin:0 0 12px;color:#6b7280;font-size:13px;">Click below to provide feedback on the website.</p>
                <a href="${feedbackHref}" target="_blank" style="display:inline-block;margin-top:12px;padding:10px 16px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;">Rate Your Experience</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 24px;text-align:center;color:#6b7280;font-size:12px;">
              <div style="margin:8px 0 12px;">${socialLinksHtml}</div>
              <p style="margin:0;">© ${new Date().getFullYear()} ${escapeHtml(brand.name)} • ${escapeHtml(brand.domain)}</p>
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  const previewHTML = useMemo(() => {
    return buildTemplate({
      recipient: { name: form.recipientName },
      subject: form.subject,
      message: messageHtml,
      brand
    });
  }, [form.recipientName, form.subject, messageHtml, brand]);

  return (
    <div className="p-6 max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        <FaPaperPlane /> Send Email
      </h2>

      {status.text && (
        <div
          className={`p-3 rounded mb-4 ${
            status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Recipient Email</label>
          <input
            type="email"
            name="to"
            value={form.to}
            onChange={handleChange}
            placeholder="recipient@example.com"
            className="w-full border rounded p-3 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Recipient Name (optional)</label>
          <input
            type="text"
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border rounded p-3 dark:bg-gray-700 dark:text-white"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full border rounded p-3 dark:bg-gray-700 dark:text-white"
            required
            maxLength={255}
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
          <div className="flex items-center gap-2 mb-2 bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
            <select onChange={(e) => exec('fontName', e.target.value)} className="border rounded p-1 dark:bg-gray-800 dark:text-white">
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
            </select>
            <select onChange={(e) => exec('fontSize', e.target.value)} className="border rounded p-1 dark:bg-gray-800 dark:text-white">
              <option value="2">Small</option>
              <option value="3">Normal</option>
              <option value="4">Large</option>
              <option value="5">X-Large</option>
            </select>
            <select value={contentAlign} onChange={(e) => setContentAlign(e.target.value)} className="border rounded p-1 dark:bg-gray-800 dark:text-white">
              <option value="left">Block Align: Left</option>
              <option value="center">Block Align: Center</option>
              <option value="right">Block Align: Right</option>
            </select>
            <select onChange={(e) => setLineHeight(e.target.value)} className="border rounded p-1 dark:bg-gray-800 dark:text-white">
              <option value="1.4">Line Spacing: 1.4</option>
              <option value="1.6">Line Spacing: 1.6</option>
              <option value="1.8">Line Spacing: 1.8</option>
              <option value="2">Line Spacing: 2.0</option>
            </select>
            <button type="button" onClick={() => exec('bold')} className="px-2 py-1 rounded bg-white dark:bg-gray-800">B</button>
            <button type="button" onClick={() => exec('italic')} className="px-2 py-1 rounded bg-white dark:bg-gray-800">I</button>
            <button type="button" onClick={() => exec('underline')} className="px-2 py-1 rounded bg-white dark:bg-gray-800">U</button>
            <input type="color" onChange={(e) => exec('foreColor', e.target.value)} className="w-6 h-6" />
            <button type="button" onClick={() => exec('justifyLeft')} className="px-2 py-1 rounded bg-white dark:bg-gray-800">L</button>
            <button type="button" onClick={() => exec('justifyCenter')} className="px-2 py-1 rounded bg-white dark:bg-gray-800">C</button>
            <button type="button" onClick={() => exec('justifyRight')} className="px-2 py-1 rounded bg-white dark:bg-gray-800">R</button>
            <button type="button" onClick={() => exec('insertUnorderedList')} className="px-2 py-1 rounded bg-white dark:bg-gray-800">•</button>
            <button type="button" onClick={() => exec('insertOrderedList')} className="px-2 py-1 rounded bg-white dark:bg-gray-800">1.</button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('Enter URL');
                if (url) exec('createLink', url);
              }}
              className="px-2 py-1 rounded bg-white dark:bg-gray-800"
            >
              Link
            </button>
            <select onChange={(e) => exec('insertText', e.target.value)} className="border rounded p-1 dark:bg-gray-800 dark:text-white">
              <option value="">Emoji</option>
              <option value="😀">😀</option>
              <option value="🚀">🚀</option>
              <option value="✨">✨</option>
              <option value="💡">💡</option>
              <option value="🔥">🔥</option>
              <option value="🎯">🎯</option>
              <option value="✅">✅</option>
            </select>
          </div>
          <div
            ref={editorRef}
            contentEditable
            onInput={() => setMessageHtml(editorRef.current ? editorRef.current.innerHTML : "")}
            className="w-full border rounded p-3 dark:bg-gray-700 dark:text-white min-h-[10rem]"
          />
          <p className="text-xs text-gray-500 mt-1">The message is sent as HTML and wrapped in the branded template.</p>
        </div>

        <button
          type="submit"
          disabled={sending}
          className={`bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 ${sending ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {sending ? "Sending..." : "Send Email"}
        </button>
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Preview</h3>
          <span className="text-xs text-gray-500">Updates in real time as you type</span>
        </div>
        <div className="border rounded-lg overflow-auto bg-gray-50 dark:bg-gray-900">
          <div
            className="min-h-[10rem]"
            dangerouslySetInnerHTML={{ __html: previewHTML }}
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default EmailSender;
