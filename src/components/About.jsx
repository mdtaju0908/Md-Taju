import { useEffect, useState } from "react";
import api from "../utils/api";
import { FaDownload } from "react-icons/fa";

// Simple HTML sanitizer to prevent XSS
const sanitizeHtml = (html = "") => {
  if (typeof window === 'undefined') return html;
  const container = document.createElement("div");
  container.innerHTML = String(html);
  const scrub = (node) => {
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    if (tag === "script" || tag === "style" || tag === "iframe" || tag === "object") {
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

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const res = await api.get("/about");
        // Handle potentially wrapped data or direct data
        const data = res.data?.data || res.data; 
        setAbout(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch about info:", err);
        setError("Could not load profile information.");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-gray-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-64 w-64 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-blue-500 underline hover:text-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!about) return null;

  const resumeUrl = typeof about.resume === 'string' ? about.resume : about.resume?.url;
  const photoUrl = about.photo?.url;

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <div className="order-2 md:order-1">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">About Me</h2>

          <div
            className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(about.bio || "") }}
          />

          {about.goals && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                Career Goals
              </h3>
              <div
                className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(about.goals || "") }}
              />
            </div>
          )}

          {about.hobbies?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Hobbies
              </h3>
              <div className="flex gap-2 flex-wrap">
                {about.hobbies.map((h, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 shadow-sm"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <FaDownload /> Download Resume
            </a>
          )}
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center order-1 md:order-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={photoUrl || "https://ui-avatars.com/api/?name=Md+Taju&size=400&background=0D8ABC&color=fff"}
              alt="Profile"
              onError={(e) =>
                (e.target.src = "https://ui-avatars.com/api/?name=Md+Taju&size=400&background=0D8ABC&color=fff")
              }
              className="relative w-72 h-72 md:w-80 md:h-80 rounded-2xl object-cover shadow-2xl ring-4 ring-white dark:ring-gray-800"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
