"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

const AdminBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
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
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1d1d1f]">Manage Blog Posts</h1>
            <p className="text-[#6e6e73]">View and manage all blog posts</p>
          </div>
          <button 
            onClick={() => navigate('/admin/blog/new')}
            className="mt-4 md:mt-0 bg-[#e8531a] text-white px-4 py-2 rounded-lg hover:bg-[#e8531a]/90 transition-colors"
          >
            Add New Post
          </button>
        </div>

        {/* Blog posts table */}
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
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Published</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-[#d2d2d7]">
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
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
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
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;