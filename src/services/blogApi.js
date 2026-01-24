import api from '../utils/api';

const blogApi = {
  getBlogs: async (pageNumber = 1, keyword = '', category = '') => {
    const { data } = await api.get(`/blogs?pageNumber=${pageNumber}&keyword=${keyword}&category=${category}`);
    return data;
  },

  getBlogById: async (id) => {
    const { data } = await api.get(`/blogs/${id}`);
    return data;
  },

  getBlogBySlug: async (slug) => {
    const { data } = await api.get(`/blogs/slug/${slug}`);
    return data;
  },

  getPopularBlogs: async (limit = 5) => {
    const { data } = await api.get(`/blogs/popular?limit=${limit}`);
    return data;
  },

  reactToBlog: async (id, type = 'like') => {
    const { data } = await api.post(`/blogs/${id}/react`, { type });
    return data;
  },

  createBlog: async (blogData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const { data } = await api.post('/blogs', blogData, config);
    return data;
  },

  updateBlog: async (id, blogData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const { data } = await api.put(`/blogs/${id}`, blogData, config);
    return data;
  },

  deleteBlog: async (id) => {
    const { data } = await api.delete(`/blogs/${id}`);
    return data;
  },
};

export default blogApi;
