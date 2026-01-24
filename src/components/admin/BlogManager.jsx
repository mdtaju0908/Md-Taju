import React, { useState, useEffect } from 'react';
import blogApi from '../../services/blogApi';
import RichTextEditor from './RichTextEditor';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaNewspaper } from 'react-icons/fa';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    author: 'Admin',
    image: null,
    metaKeywords: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Fetch all blogs (pagination can be handled here if list is long, assuming simple list for now)
      // The API supports pagination, so we might want to fetch a large number or implement pagination in admin too.
      // For simplicity, fetching page 1 with large limit or just page 1.
      // Modifying getBlogs to accept large limit if needed, or loop.
      // Here we just fetch page 1.
      const data = await blogApi.getBlogs(1, '', ''); 
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: '',
      author: 'Admin',
      image: null,
      metaKeywords: '',
    });
    setPreviewImage(null);
    setEditingBlog(null);
    setShowForm(false);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      category: blog.category,
      author: blog.author,
      image: null,
      metaKeywords: blog.metaKeywords ? blog.metaKeywords.join(', ') : '',
    });
    if (blog.imageUrl) {
       setPreviewImage(blog.imageUrl);
    } else if (blog.image) {
       let baseUrl = import.meta.env.VITE_API_BASE_URL || '';
       baseUrl = baseUrl.replace(/\/api$/, '').replace(/\/+$/, '');
       setPreviewImage(blog.image.startsWith('http') ? blog.image : `${baseUrl}${blog.image.startsWith('/') ? '' : '/'}${blog.image}`);
    } else {
        setPreviewImage(null);
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogApi.deleteBlog(id);
        setBlogs(blogs.filter((b) => b._id !== id));
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('author', formData.author);
    data.append('metaKeywords', formData.metaKeywords);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingBlog) {
        await blogApi.updateBlog(editingBlog._id, data);
        alert('Blog updated successfully');
      } else {
        await blogApi.createBlog(data);
        alert('Blog created successfully');
      }
      fetchBlogs();
      resetForm();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FaNewspaper /> Blog Manager
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus /> New Blog
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold dark:text-white">
              {editingBlog ? 'Edit Blog' : 'Create New Blog'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Short Summary)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Rich Text)</label>
              <RichTextEditor value={formData.content} onChange={handleContentChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Keywords (Tags - comma separated)</label>
              <input
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleInputChange}
                placeholder="e.g., React, Node.js, MERN"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">These help with SEO and display as tags on the blog post</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                />
                {previewImage && (
                  <img src={previewImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg shadow-sm border" />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Saving...' : (editingBlog ? 'Update Blog' : 'Publish Blog')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
               {/* Image */}
               <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                  {(blog.imageUrl || blog.image) && (
                    <img 
                      src={blog.imageUrl ? blog.imageUrl : (() => {
                        let baseUrl = import.meta.env.VITE_API_BASE_URL || '';
                        baseUrl = baseUrl.replace(/\/api$/, '').replace(/\/+$/, '');
                        return blog.image.startsWith('http') ? blog.image : `${baseUrl}${blog.image.startsWith('/') ? '' : '/'}${blog.image}`;
                      })()} 
                      alt={blog.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
               </div>
               
               <div className="p-4 flex-grow">
                  <h3 className="font-bold text-lg dark:text-white mb-2 line-clamp-1">{blog.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{blog.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">{blog.category}</span>
                  </div>
               </div>

               <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManager;
