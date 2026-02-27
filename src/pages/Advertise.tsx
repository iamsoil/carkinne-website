"use client";

import { useState } from 'react';

const Advertise = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    package: 'Basic',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you would send this data to your backend here
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-4">Thank You!</h2>
          <p className="text-[#6e6e73]">
            We'll contact you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="w-full bg-[#1d1d1f] py-20 px-6 text-center relative">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Reach Nepal's Car Buyers
          </h1>
          <p className="text-lg text-[#a0a0a0] max-w-2xl mx-auto">
            Advertise on CarKinne and connect with thousands of Nepalis actively searching for their next car.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12">
            <div>
              <p className="text-2xl font-bold text-[#e8531a]">50,000+</p>
              <p className="text-sm text-white">Monthly Visitors</p>
            </div>
            <div className="h-12 w-px bg-[#333] hidden md:block"></div>
            <div>
              <p className="text-2xl font-bold text-[#e8531a]">8+</p>
              <p className="text-sm text-white">Cities Reached</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Advertise Section */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center text-[#1d1d1f] mb-16">
          Why Advertise on CarKinne?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
            <h3 className="text-base font-semibold text-[#1d1d1f] mb-3">Targeted Audience</h3>
            <p className="text-sm text-[#6e6e73]">
              People on CarKinne are actively looking to buy a car — not casual browsers.
            </p>
          </div>
          <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
            <h3 className="text-base font-semibold text-[#1d1d1f] mb-3">Nepal-Focused</h3>
            <p className="text-sm text-[#6e6e73]">
              100% Nepal traffic. Reach buyers in Kathmandu, Pokhara, Biratnagar and beyond.
            </p>
          </div>
          <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
            <h3 className="text-base font-semibold text-[#1d1d1f] mb-3">Multiple Formats</h3>
            <p className="text-sm text-[#6e6e73]">
              Banner ads, featured listings, sponsored content and newsletter placements.
            </p>
          </div>
          <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
            <h3 className="text-base font-semibold text-[#1d1d1f] mb-3">Affordable Rates</h3>
            <p className="text-sm text-[#6e6e73]">
              Flexible packages for dealerships, banks, insurance companies and auto brands.
            </p>
          </div>
        </div>
      </div>

      {/* Who Is It For Section */}
      <div className="w-full bg-[#f5f5f7] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-[#1d1d1f] mb-16">
            Who Should Advertise?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f] mb-3">Car Dealerships</h3>
              <p className="text-sm text-[#6e6e73]">
                Promote your showroom, feature your inventory and drive footfall from active buyers.
              </p>
            </div>
            <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f] mb-3">Banks & Finance</h3>
              <p className="text-sm text-[#6e6e73]">
                Reach people calculating EMIs and comparing car loan rates — your ideal customers.
              </p>
            </div>
            <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f] mb-3">Insurance Companies</h3>
              <p className="text-sm text-[#6e6e73]">
                Connect with new car buyers at the exact moment they need vehicle insurance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center text-[#1d1d1f] mb-4">
          Advertising Packages
        </h2>
        <p className="text-center text-[#6e6e73] mb-16">
          Simple, transparent pricing
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Package */}
          <div className="border border-[#d2d2d7] rounded-2xl p-7">
            <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Basic</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold text-[#e8531a]">Rs. 15,000</span>
              <span className="text-sm text-[#6e6e73]">/month</span>
            </div>
            <div className="border-t border-[#d2d2d7] my-4"></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">Homepage banner (300x250)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">30 days placement</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">10,000+ impressions</span>
              </li>
            </ul>
            <button className="w-full border border-[#1d1d1f] text-[#1d1d1f] py-3 rounded-lg font-medium hover:bg-[#1d1d1f] hover:text-white transition-colors">
              Get Started
            </button>
          </div>
          
          {/* Featured Package */}
          <div className="border-2 border-[#e8531a] rounded-2xl p-7 bg-[#fff8f5] relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#e8531a] text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
            <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Featured</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold text-[#e8531a]">Rs. 35,000</span>
              <span className="text-sm text-[#6e6e73]">/month</span>
            </div>
            <div className="border-t border-[#d2d2d7] my-4"></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">Homepage hero banner</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">Featured car listing (top of results)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">Newsletter mention</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">25,000+ impressions</span>
              </li>
            </ul>
            <button className="w-full border border-[#1d1d1f] text-[#1d1d1f] py-3 rounded-lg font-medium hover:bg-[#1d1d1f] hover:text-white transition-colors">
              Get Started
            </button>
          </div>
          
          {/* Premium Package */}
          <div className="border border-[#d2d2d7] rounded-2xl p-7">
            <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Premium</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold text-[#e8531a]">Rs. 75,000</span>
              <span className="text-sm text-[#6e6e73]">/month</span>
            </div>
            <div className="border-t border-[#d2d2d7] my-4"></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">All Featured benefits</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">Sponsored blog post</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">Social media mention</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">Dedicated landing page</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#e8531a] mr-2">✓</span>
                <span className="text-sm text-[#6e6e73]">60,000+ impressions</span>
              </li>
            </ul>
            <button className="w-full border border-[#1d1d1f] text-[#1d1d1f] py-3 rounded-lg font-medium hover:bg-[#1d1d1f] hover:text-white transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="w-full bg-[#f5f5f7] py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-[#1d1d1f] mb-4">
            Get In Touch
          </h2>
          <p className="text-center text-[#6e6e73] mb-16">
            Fill out the form and we'll get back to you within 24 hours.
          </p>
          
          <div className="bg-white border border-[#d2d2d7] rounded-2xl p-10">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                    Company/Showroom Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Package Interest
                </label>
                <select
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                >
                  <option value="Basic">Basic</option>
                  <option value="Featured">Featured</option>
                  <option value="Premium">Premium</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your business and advertising goals..."
                  className="w-full px-4 py-3 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#e8531a] text-white py-3.5 rounded-lg font-medium hover:bg-[#e8531a]/90 transition-colors"
              >
                Send Enquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertise;