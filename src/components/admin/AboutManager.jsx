import { useEffect, useState } from "react";
import api from "../../utils/api";
import RichTextEditor from "./RichTextEditor";

export default function AboutManager() {
  const [form, setForm] = useState({
    bio: "",
    goals: "",
    hobbiesText: "",
    photo: null,
    resumeUrl: "",
    heroBg: null,
    heroBgUrl: ""
  });
  
  // To show previews or existing URLs
  const [existingData, setExistingData] = useState({
    photoUrl: "",
    resumeUrl: "",
    heroBgUrl: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  // Hero backgrounds (slider)
  const [heroImages, setHeroImages] = useState([]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [intervalMs, setIntervalMs] = useState(6000);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    fetchAbout();
    fetchHeroBackgrounds();
  }, []);

  const fetchAbout = async () => {
    try {
        const { data } = await api.get("/about");
        if (data && Object.keys(data).length > 0) {
            // Prioritize resumeUrl, fallback to legacy resume.url or string resume
            const resumeUrl = data.resumeUrl || (typeof data.resume === 'string' ? data.resume : (data.resume?.url || ""));
            const heroBgUrl = data.heroBg?.url || data.heroBgUrl || "";
            
            setForm({
                bio: data.bio || "",
                goals: data.goals || "",
                hobbiesText: data.hobbies ? data.hobbies.join(", ") : "",
                photo: null,
                resumeUrl: resumeUrl,
                heroBg: null,
                heroBgUrl
            });
            setExistingData({
                photoUrl: data.photo?.url || data.photoUrl || "",
                resumeUrl: resumeUrl,
                heroBgUrl
            });
        }
    } catch (error) {
        console.error("Error fetching about:", error);
    }
  };

  const fetchHeroBackgrounds = async () => {
    try {
      const { data } = await api.get("/about/hero-backgrounds");
      setHeroImages(Array.isArray(data?.images) ? data.images : []);
      const s = data?.settings || {};
      setAutoRotate(typeof s.autoRotate === 'boolean' ? s.autoRotate : true);
      setIntervalMs(typeof s.intervalMs === 'number' ? s.intervalMs : 6000);
    } catch (error) {
      console.error("Error fetching hero backgrounds:", error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'photo' || e.target.name === 'heroBg') {
        setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("bio", form.bio);
    formData.append("goals", form.goals);
    formData.append("hobbies", form.hobbiesText);
    formData.append("resumeUrl", form.resumeUrl);
    formData.append("heroBgUrl", form.heroBgUrl);

    if (form.photo) {
        formData.append("photo", form.photo);
    }
    if (form.heroBg) {
        formData.append("heroBg", form.heroBg);
    }

    try {
      await api.put("/about", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMsg("Saved successfully ✅");
      fetchAbout(); // Refresh to get new URLs
    } catch (error) {
        console.error("Error saving about:", error);
        setMsg("Save failed ❌");
    } finally {
        setLoading(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete About Section? This will remove all data including images.")) return;
    setLoading(true);
    
    try {
        await api.delete("/about");
        setForm({
            bio: "",
            goals: "",
            hobbiesText: "",
            photo: null,
            resumeUrl: "",
            heroBg: null,
            heroBgUrl: ""
        });
        setExistingData({
            photoUrl: "",
            resumeUrl: "",
            heroBgUrl: ""
        });
        setMsg("Deleted ❌");
    } catch (error) {
        console.error("Error deleting about:", error);
        setMsg("Delete failed ❌");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">About Manager</h2>

      {msg && <p className={`mb-4 p-3 rounded ${msg.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{msg}</p>}

      <form onSubmit={save} className="space-y-6">
        <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <RichTextEditor
              value={form.bio}
              onChange={(html) => setForm({ ...form, bio: html })}
            />
            <p className="text-xs text-gray-500 mt-1">Rich text will be saved as formatted HTML.</p>
        </div>

        <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Goals</label>
            <RichTextEditor
              value={form.goals}
              onChange={(html) => setForm({ ...form, goals: html })}
            />
        </div>

        <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Hobbies (comma separated)</label>
            <input 
                type="text"
                name="hobbiesText" 
                value={form.hobbiesText} 
                onChange={handleChange} 
                placeholder="Coding, Reading, Gaming" 
                className="w-full border rounded p-3 dark:bg-gray-700 dark:text-white" 
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Photo</label>
                {existingData.photoUrl && (
                    <div className="mb-2">
                        <img src={existingData.photoUrl} alt="Current" className="h-20 w-20 object-cover rounded" />
                        <span className="text-xs text-gray-500">Current Photo</span>
                    </div>
                )}
                <input 
                    type="file" 
                    name="photo" 
                    accept="image/*"
                    onChange={handleChange} 
                    className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white" 
                />
            </div>

            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Resume URL</label>
                {existingData.resumeUrl && (
                    <div className="mb-2">
                        <a href={existingData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Current Resume</a>
                    </div>
                )}
                <input 
                    type="text" 
                    name="resumeUrl" 
                    value={form.resumeUrl}
                    onChange={handleChange} 
                    placeholder="https://drive.google.com/..."
                    className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white" 
                />
                <p className="text-xs text-gray-500 mt-1">Paste a direct link to your resume (e.g., Google Drive, Dropbox)</p>
            </div>
        </div>

        {/* Removed legacy single hero background UI */}

        {/* Hero Background Slider Management */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Hero Background Slider</h3>
          
          {/* Settings */}
          <div className="flex items-end gap-6 mb-4">
            <div className="flex items-center gap-2">
              <input
                id="autoRotate"
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
              />
              <label htmlFor="autoRotate" className="text-gray-700 dark:text-gray-300">Auto-slide ON/OFF</label>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Interval (ms)</label>
              <input
                type="number"
                min="2000"
                step="500"
                value={intervalMs}
                onChange={(e) => setIntervalMs(parseInt(e.target.value, 10) || 6000)}
                className="w-32 border rounded p-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await api.put("/about/hero-backgrounds/settings", { autoRotate, intervalMs });
                  setMsg("Slider settings saved ✅");
                } catch (e) {
                  console.error(e);
                  setMsg("Failed to save settings ❌");
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save Settings
            </button>
          </div>

          {/* Upload multiple images */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Upload Background Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;
                if (heroImages.length + files.length > 6) {
                  setMsg("Maximum 6 images allowed ❌");
                  e.target.value = "";
                  return;
                }
                const fd = new FormData();
                files.forEach(f => fd.append("heroBackgrounds", f));
                setLoading(true);
                setMsg("");
                try {
                  await api.put("/about/hero-backgrounds/upload", fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  setMsg("Uploaded backgrounds ✅");
                  await fetchHeroBackgrounds();
                } catch (err) {
                  console.error(err);
                  setMsg("Upload failed ❌");
                } finally {
                  setLoading(false);
                  e.target.value = "";
                }
              }}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Preview, Delete, Drag & Reorder */}
          <div className="grid grid-cols-2 gap-4">
            {heroImages.map((url, index) => (
              <div
                key={url}
                className="relative group border rounded overflow-hidden"
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex === null || dragIndex === index) return;
                  const next = [...heroImages];
                  const [moved] = next.splice(dragIndex, 1);
                  next.splice(index, 0, moved);
                  setHeroImages(next);
                }}
              >
                <img src={url} alt="Hero bg" className="h-28 w-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm("Delete this image?")) return;
                      try {
                        await api.delete(`/about/hero-backgrounds/${index}`);
                        setMsg("Image deleted ✅");
                        await fetchHeroBackgrounds();
                      } catch (e) {
                        console.error(e);
                        setMsg("Delete failed ❌");
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {heroImages.length > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const order = heroImages.slice();
                    await api.put("/about/hero-backgrounds/reorder", { order });
                    setMsg("Order saved ✅");
                  } catch (e) {
                    console.error(e);
                    setMsg("Failed to save order ❌");
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save Order
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            onClick={remove} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
          >
            Delete Section
          </button>
        </div>
      </form>
    </div>
  );
}
