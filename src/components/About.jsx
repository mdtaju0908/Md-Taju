import { useEffect, useState } from "react";
import api from "../utils/api";
import { FaDownload } from "react-icons/fa";

export default function About() {
  const [about, setAbout] = useState(null);
  
  const sanitizeHtml = (html = "") => {
    const container = document.createElement("div");
    container.innerHTML = String(html);
    const scrub = (node) => {
      if (node.nodeType !== 1) return;
      const tag = node.tagName.toLowerCase();
      if (tag === "script" || tag === "style") {
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

  useEffect(() => {
    api.get("/about").then((res) => setAbout(res.data));
  }, []);

  if (!about) return <div className="py-20 text-center">Loading...</div>;

  const resumeUrl = typeof about.resume === 'string' ? about.resume : about.resume?.url;
  const photoUrl = about.photo?.url;

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14">

        {/* LEFT */}
        <div>
          <h2 className="text-4xl font-bold mb-6">About Me</h2>

          <div
            className="prose prose-sm sm:prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-6"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(about.bio || "") }}
          />

          {about.goals && (
            <>
              <h3 className="text-xl font-semibold mb-2">
                Career Goals
              </h3>
              <div
                className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(about.goals || "") }}
              />
            </>
          )}

          {about.hobbies?.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {about.hobbies.map((h, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded"
            >
              <FaDownload /> Download Resume
            </a>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex justify-center">
          <img
            src={photoUrl || "https://via.placeholder.com/350"}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/350")
            }
            className="w-72 h-72 rounded-2xl object-cover shadow"
          />
        </div>
      </div>
    </section>
  );
}
