import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShareButtons from '../components/blog/ShareButtons';
import blogApi from '../services/blogApi';
import { FaCalendar, FaUser, FaTag, FaArrowLeft, FaClock, FaEye } from 'react-icons/fa';

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [reactionCounts, setReactionCounts] = useState({ like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 });
  const [activeReaction, setActiveReaction] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getBlogBySlug(slug);
        setBlog(data);
        setReactionCounts({
          like: data.reactions?.like || 0,
          love: data.reactions?.love || 0,
          care: data.reactions?.care || 0,
          haha: data.reactions?.haha || 0,
          wow: data.reactions?.wow || 0,
          sad: data.reactions?.sad || 0,
          angry: data.reactions?.angry || 0,
        });
        const storedReaction = localStorage.getItem(`blog-reaction-${slug}`);
        setActiveReaction(storedReaction || null);

        document.title = `${data.title} | Md Taju Blog`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.description);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = data.description;
          document.head.appendChild(meta);
        }

        const updateOrCreateMeta = (property, content) => {
          let meta = document.querySelector(`meta[property="${property}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', content);
        };

        updateOrCreateMeta('og:title', data.title);
        updateOrCreateMeta('og:description', data.description);
        if (data.imageUrl) {
          updateOrCreateMeta('og:image', data.imageUrl);
        }
        updateOrCreateMeta('og:type', 'article');

        const blogsData = await blogApi.getBlogs(1, '', data.category);
        setRelatedBlogs(blogsData.blogs.filter((b) => b._id !== data._id).slice(0, 3));

        const popularData = await blogApi.getPopularBlogs(5);
        setPopularBlogs(popularData);
      } catch (err) {
        setError('Failed to load blog post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const reactionOptions = [
    { key: 'like', emoji: '👍', label: 'Like' },
    { key: 'love', emoji: '❤️', label: 'Love' },
    { key: 'care', emoji: '🤗', label: 'Care' },
    { key: 'haha', emoji: '😂', label: 'Haha' },
    { key: 'wow', emoji: '😮', label: 'Wow' },
    { key: 'sad', emoji: '😢', label: 'Sad' },
    { key: 'angry', emoji: '😡', label: 'Angry' },
  ];

  const handleReact = async (type) => {
    try {
      const result = await blogApi.reactToBlog(blog._id, type);
      setReactionCounts({
        like: result.reactions?.like || 0,
        love: result.reactions?.love || 0,
        care: result.reactions?.care || 0,
        haha: result.reactions?.haha || 0,
        wow: result.reactions?.wow || 0,
        sad: result.reactions?.sad || 0,
        angry: result.reactions?.angry || 0,
      });
      setActiveReaction(result.activeType || null);
      localStorage.setItem(`blog-reaction-${slug}`, result.activeType || '');
    } catch (err) {
      console.error('Failed to react to blog', err);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    let baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    baseUrl = baseUrl.replace(/\/api$/, '').replace(/\/+$/, '');
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${baseUrl}${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'Blog not found'}</h2>
          <Link to="/blogs" className="text-blue-600 hover:underline">
            &larr; Back to Blogs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-16 max-w-6xl">
        <Link to="/blogs" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8 group">
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Blogs
        </Link>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-10 items-start">
          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {(blog.imageUrl || blog.image) && (
              <img
                src={getImageUrl(blog.imageUrl || blog.image)}
                alt={blog.title}
                className="w-full h-96 object-cover object-center"
              />
            )}

            <div className="p-8 md:p-12">
              <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                    <FaTag className="mr-2" /> {blog.category}
                  </span>
                  <span className="flex items-center">
                    <FaCalendar className="mr-2" /> {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="flex items-center">
                    <FaUser className="mr-2" /> {blog.author}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm">
                  {blog.readingTime && (
                    <span className="inline-flex items-center text-gray-600 dark:text-gray-300">
                      <FaClock className="mr-2" /> {blog.readingTime} min read
                    </span>
                  )}
                  <span className="inline-flex items-center text-gray-600 dark:text-gray-300">
                    <FaEye className="mr-2" /> {blog.views || 0} views
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {reactionOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => handleReact(option.key)}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs transition-colors ${
                          activeReaction === option.key
                            ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800'
                            : 'text-gray-600 border-gray-200 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span>{option.emoji}</span>
                        <span className="font-medium">{reactionCounts[option.key] || 0}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </header>

              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>

              <ShareButtons
                title={blog.title}
                url={currentUrl}
                description={blog.description}
              />

              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 my-8 border-l-4 border-blue-600">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {blog.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Written by</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{blog.author}</p>
                  </div>
                </div>
              </div>

              {blog.metaKeywords && blog.metaKeywords.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {blog.metaKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Popular Reads</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">Last 24h uniques</span>
              </div>
              <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
                {popularBlogs.length === 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 pt-2">No popular blogs yet.</p>
                )}
                {popularBlogs.map((item) => (
                  <Link
                    key={item._id}
                    to={`/blog/${item.slug}`}
                    className="flex gap-3 pt-2 group"
                  >
                    {(item.imageUrl || item.image) && (
                      <img
                        src={getImageUrl(item.imageUrl || item.image)}
                        alt={item.title}
                        className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span className="inline-flex items-center">
                          <FaClock className="mr-1" /> {item.readingTime || 1} min
                        </span>
                        <span className="inline-flex items-center">
                          <FaEye className="mr-1" /> {item.views || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {relatedBlogs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  to={`/blog/${relatedBlog.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  {(relatedBlog.imageUrl || relatedBlog.image) && (
                    <img
                      src={getImageUrl(relatedBlog.imageUrl || relatedBlog.image)}
                      alt={relatedBlog.title}
                      className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(relatedBlog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailsPage;
