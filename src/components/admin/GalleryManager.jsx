import React, { useState, useEffect, useContext } from 'react';
import api, { unwrapList } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { FaTrash, FaUpload, FaImage } from 'react-icons/fa';

const GalleryManager = () => {
  const { user } = useContext(AuthContext);
  const [galleryItems, setGalleryItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // File
  const [imageUrl, setImageUrl] = useState(''); // URL
  const [inputType, setInputType] = useState('url'); // 'url' or 'file'
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchGallery = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get('/gallery');
      const list = unwrapList(res, 'data');
      setGalleryItems(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setGalleryItems([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreview(e.target.value);
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image && !imageUrl) {
      setMessage({ type: 'error', text: 'Please select an image or provide a URL' });
      return;
    }

    setLoading(true);
    
    try {
      let config = {};
      let data;

      if (image) {
        data = new FormData();
        data.append('title', title);
        data.append('description', description);
        data.append('image', image);
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      } else {
        data = {
          title,
          description,
          imageUrl,
        };
        config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
      }

      await api.post('/gallery', data, config);
      setMessage({ type: 'success', text: 'Image added successfully!' });
      setTitle('');
      setDescription('');
      setImage(null);
      setImageUrl('');
      setPreview('');
      fetchGallery();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error adding image' });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await api.delete(`/gallery/${id}`);
        setGalleryItems(galleryItems.filter((item) => item._id !== id));
        setMessage({ type: 'success', text: 'Image deleted successfully' });
      } catch (error) {
        setMessage({ type: 'error', text: error.response?.data?.message || 'Error deleting image' });
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Gallery Management</h2>

      {message.text && (
        <div className={`p-4 rounded-md mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                rows="3"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Image Source</label>
              <div className="flex gap-4 mb-2">
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${inputType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setInputType('url')}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${inputType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setInputType('file')}
                >
                  Upload File
                </button>
              </div>

              {inputType === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    accept="image/*"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                    <FaUpload className="text-3xl text-gray-400 mb-2" />
                    <span className="text-gray-500">Click to upload image</span>
                  </label>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg min-h-[200px]">
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-64 rounded shadow-md object-contain" />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <FaImage className="text-4xl mb-2" />
                <span>Image Preview</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
        >
          {loading ? 'Adding...' : 'Add to Gallery'}
        </button>
      </form>

      {/* List of Gallery Items */}
      {fetchLoading ? (
        <p className="text-gray-500">Loading gallery...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(galleryItems) && galleryItems.length > 0 ? (
            galleryItems.map((item) => (
              <div key={item._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative group">
                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash />
                </button>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No images found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
