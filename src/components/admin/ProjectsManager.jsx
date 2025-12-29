import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    techStack: "",
    liveLink: "",
    githubLink: ""
  });

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data || []);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load projects ❌" });
      console.error(error);
    }
  };

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      techStack: formData.techStack
        .split(",")
        .map(item => item.trim())
        .filter(Boolean)
    };

    try {
      if (currentProject) {
        await api.put(`/projects/${currentProject._id}`, payload);
        setMessage({ type: "success", text: "Project updated successfully ✅" });
      } else {
        await api.post("/projects", payload);
        setMessage({ type: "success", text: "Project added successfully 🎉" });
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Project save failed ❌"
      });
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (project) => {
    setIsEditing(true);
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || "",
      techStack: project.techStack?.join(", ") || "",
      liveLink: project.liveLink || "",
      githubLink: project.githubLink || ""
    });
    setMessage({ type: "", text: "" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      setMessage({ type: "success", text: "Project deleted 🗑️" });
      fetchProjects();
    } catch (error) {
      setMessage({ type: "error", text: "Delete failed ❌" });
    }
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setIsEditing(false);
    setCurrentProject(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      techStack: "",
      liveLink: "",
      githubLink: ""
    });
  };

  /* ================= UI ================= */
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Projects Manager
        </h2>

        <button
          onClick={() => {
            resetForm();
            setIsEditing(true);
            setMessage({ type: "", text: "" });
          }}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FaPlus className="mr-2" /> Add Project
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-md text-sm font-medium
          ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            {currentProject ? "Edit Project" : "Add New Project"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Title" required value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />

            <Textarea label="Description" required value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />

            <Input label="Image URL" value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
            />

            <Input label="Tech Stack (comma separated)" value={formData.techStack}
              onChange={e => setFormData({ ...formData, techStack: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Live Link" value={formData.liveLink}
                onChange={e => setFormData({ ...formData, liveLink: e.target.value })}
              />
              <Input label="GitHub Link" value={formData.githubLink}
                onChange={e => setFormData({ ...formData, githubLink: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Cancel
              </button>
              <button type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 && (
          <p className="text-gray-500">No projects found.</p>
        )}

        {projects.map(project => (
          <div key={project._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {project.description.slice(0, 100)}...
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech, i) => (
                  <span key={i}
                    className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleEdit(project)}
                className="text-blue-600 hover:text-blue-800">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(project._id)}
                className="text-red-600 hover:text-red-800">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= SMALL REUSABLE INPUTS ================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input {...props}
      className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <textarea {...props}
      className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
    />
  </div>
);

export default ProjectsManager;
