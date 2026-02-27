"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

const AdminBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Buying Guide',
    excerpt: '',
    content: '',
    cover_image: '',
    seo_title: '',
    seo_description: '',
    is_published: false
  });
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setMessage({type: 'error', text: 'Failed to load blog posts'});
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: !isPublished })
        .eq('id', id);
      
      if (error) throw error;
      fetchPosts();
      setMessage({type: 'success', text: 'Post status updated'});
    } catch (error) {
      console.error('Error updating post:', error);
      setMessage({type: 'error', text: 'Failed to update post status'});
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchPosts();
      setMessage({type: 'success', text: 'Post deleted successfully'});
    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage({type: 'error', text: 'Failed to delete post'});
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || 'Buying Guide',
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image: post.cover_image || '',
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      is_published: post.is_published || false
    });
    setView('form');
  };

  const handleAddNew = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Buying Guide',
      excerpt: '',
      content: '',
      cover_image: '',
      seo_title: '',
      seo_description: '',
      is_published: false
    });
    setView('form');
  };

  const handleCancel = () => {
    setView('list');
    setEditingPost(null);
    setMessage(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: editingPost ? formData.slug : generateSlug(title)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const blogData = {
        ...formData,
        published_at: formData.is_published ? new Date().toISOString() : null
      };
      
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', editingPost.id);
        
        if (error) throw error;
        setMessage({type: 'success', text: 'Post updated successfully'});
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([blogData]);
        
        if (error) throw error;
        setMessage({type: 'success', text: 'Post created successfully'});
        
        // Reset form
        setFormData({
          title: '',
          slug: '',
          category: 'Buying Guide',
          excerpt: '',
          content: '',
          cover_image: '',
          seo_title: '',
          seo_description: '',
          is_published: false
        });
      }
      
      fetchPosts();
      setView('list');
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage({type: 'error', text: 'Failed to save post'});
    }
  };

  if (view === 'form') {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#1d1d1f]">
              {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
            </h1>
            <button
              onClick={handleCancel}
              className="flex items-center text-[#6e6e73] hover:text-[#1d1d1f]"
            >
              <X size={20} className="mr-1" />
              Cancel
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border border-[#d2d2d7] rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                >
                  <option value="Buying Guide">Buying Guide</option>
                  <option value="Electric">Electric</option>
                  <option value="Finance">Finance</option>
                  <option value="Comparisons">Comparisons</option>
                  <option value="News">News</option>
                  <option value="Tips">Tips</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  id="is_published"
                  className="h-4 w-4 text-[#e8531a] border-[#d2d2d7] rounded focus:ring-[#e8531a]"
                />
                <label htmlFor="is_published" className="ml-2 text-sm text-[#1d1d1f]">
                  Published
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Cover Image URL
              </label>
              <input
                type="text"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
              />
              {formData.cover_image && (
                <div className="mt-3">
                  <img 
                    src={formData.cover_image} 
                    alt="Preview" 
                    className="h-32 object-cover rounded-lg border border-[#d2d2d7]"
                  />
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                SEO Title
              </label>
              <input
                type="text"
                name="seo_title"
                value={formData.seo_title}
                onChange={handleChange}
                placeholder="Leave blank to use title"
                className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                SEO Description
              </label>
              <textarea
                name="seo_description"
                value={formData.seo_description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#e8531a] text-white rounded-lg py-3 font-medium hover:bg-[#e8531a]/90"
            >
              Save Post
            </button>
          </form>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1d1d1f]">Blog Posts</h1>
          <button
            onClick={handleAddNew}
            className="flex items-center bg-[#e8531a] text-white px-4 py-2 rounded-lg hover:bg-[#e8531a]/90"
          >
            <Plus size={16} className="mr-1" />
            Add New Post
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e8531a]"></div>
          </div>
        ) : (
          <div className="bg-white border border-[#d2d2d7] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5f5f7]">
                  <tr>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Cover Image</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Published</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr 
                      key={post.id} 
                      className="border-b border-[#d2d2d7] hover:bg-[#f5f5f7]"
                    >
                      <td className="py-3 px-4">
                        {post.cover_image ? (
                          <img 
                            src={post.cover_image} 
                            alt={post.title} 
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium max-w-xs truncate">{post.title}</td>
                      <td className="py-3 px-4">{post.category || 'General'}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => togglePublished(post.id, post.is_published)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.is_published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {post.is_published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        {post.created_at ? format(new Date(post.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="border border-[#d2d2d7] rounded-lg px-3 py-1 text-sm flex items-center hover:bg-[#f5f5f7]"
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="border border-[#ff3b30] text-[#ff3b30] rounded-lg px-3 py-1 text-sm flex items-center hover:bg-[#ff3b30] hover:text-white"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#6e6e73]">No blog posts found</p>
                <button
                  onClick={handleAddNew}
                  className="mt-4 text-[#e8531a] hover:underline"
                >
                  Create your first post
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;