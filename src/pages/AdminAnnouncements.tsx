"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

const AdminAnnouncements = () => {
  const [message, setMessage] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [bgColor, setBgColor] = useState('#1d1d1f');
  const [textColor, setTextColor] = useState('#ffffff');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setMessage(data.message || '');
        setLinkText(data.link_text || '');
        setLinkUrl(data.link_url || '');
        setIsActive(data.is_active !== undefined ? data.is_active : true);
        setBgColor(data.bg_color || '#1d1d1f');
        setTextColor(data.text_color || '#ffffff');
      }
    } catch (err) {
      console.error('Error fetching announcement:', err);
      setError('Please run the announcements SQL in Supabase first:\n\nCREATE TABLE IF NOT EXISTS announcements (\n  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,\n  message text NOT NULL,\n  link_text text,\n  link_url text,\n  is_active boolean DEFAULT true,\n  bg_color text DEFAULT \'#1d1d1f\',\n  text_color text DEFAULT \'#ffffff\',\n  created_at timestamptz DEFAULT now(),\n  updated_at timestamptz DEFAULT now()\n);\n\nALTER TABLE announcements ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Public can read active announcements"\n  ON announcements FOR SELECT TO anon \n  USING (is_active = true);');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    try {
      const { data: existingData } = await supabase
        .from('announcements')
        .select('id')
        .limit(1)
        .single();

      const announcementData = {
        id: existingData?.id,
        message,
        link_text: linkText,
        link_url: linkUrl,
        is_active: isActive,
        bg_color: bgColor,
        text_color: textColor,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingData?.id) {
        result = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', existingData.id);
      } else {
        // Set created_at for new records
        announcementData['created_at'] = new Date().toISOString();
        result = await supabase
          .from('announcements')
          .insert([announcementData]);
      }

      if (result.error) throw result.error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving announcement:', err);
      setError('Failed to save announcement');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e8531a]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1d1d1f]">Announcement Bar</h1>
          <p className="text-[#6e6e73]">Manage the top site announcement banner</p>
        </div>

        {error && !error.includes('SQL') && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {error && error.includes('SQL') && (
          <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
            <p className="font-bold mb-2">Database Setup Required:</p>
            <pre className="whitespace-pre-wrap text-xs bg-white p-3 rounded">
              {error}
            </pre>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
            Saved!
          </div>
        )}

        {/* Live Preview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Live Preview</h2>
          <div 
            className="text-center py-3 text-sm"
            style={{ 
              backgroundColor: bgColor,
              color: textColor
            }}
          >
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div></div>
              <span>{message || 'Your announcement message here'}</span>
              <div className="flex items-center">
                {linkText && (
                  <span className="mr-3 hover:opacity-70 transition-opacity">
                    {linkText}
                  </span>
                )}
                <span className="opacity-0">✕</span> {/* Placeholder for close button */}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white border border-[#d2d2d7] rounded-2xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Message
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                placeholder="Dashain Special — Up to Rs. 2 Lakh off on selected cars"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                  placeholder="View Offers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Link URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                  placeholder="/offers"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Background Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 border border-[#d2d2d7] rounded cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-[#6e6e73]">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Text Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-12 border border-[#d2d2d7] rounded cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-[#6e6e73]">{textColor}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-[#e8531a] border-[#d2d2d7] rounded focus:ring-[#e8531a]"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-[#1d1d1f]">
                  Active
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#e8531a] text-white rounded-lg py-3 font-medium hover:bg-[#e8531a]/90"
            >
              Save Announcement
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnnouncements;