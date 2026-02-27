"use client";

import { useState } from 'react';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="w-full bg-[#f5f5f7] py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6">
            About CarKinne
          </h1>
          <p className="text-lg md:text-xl text-[#6e6e73] max-w-2xl mx-auto">
            Nepal's smartest car buying guide — helping Nepalis make better car decisions since 2024.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-6">Our Mission</h2>
            <p className="text-base text-[#6e6e73] leading-relaxed">
              CarKinne was built to solve a real problem — buying a car in Nepal is confusing. Prices are scattered, information is outdated, and there's no single trusted source to compare options.
            </p>
            <p className="text-base text-[#6e6e73] leading-relaxed mt-4">
              We built CarKinne to change that. Our platform brings together real prices, honest comparisons, EMI calculators, showroom locations and expert guides — all in one place, updated regularly.
            </p>
          </div>
          <div className="space-y-4">
            <div className="border border-[#d2d2d7] rounded-2xl p-6">
              <p className="text-3xl font-bold text-[#e8531a]">500+</p>
              <p className="text-sm text-[#6e6e73] mt-1">Cars in database</p>
            </div>
            <div className="border border-[#d2d2d7] rounded-2xl p-6">
              <p className="text-3xl font-bold text-[#e8531a]">50,000+</p>
              <p className="text-sm text-[#6e6e73] mt-1">Monthly visitors</p>
            </div>
            <div className="border border-[#d2d2d7] rounded-2xl p-6">
              <p className="text-3xl font-bold text-[#e8531a]">8+</p>
              <p className="text-sm text-[#6e6e73] mt-1">Cities covered</p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="w-full bg-[#f5f5f7] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-[#1d1d1f] mb-16">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f]">Real Prices</h3>
              <p className="text-sm text-[#6e6e73] mt-2">
                Up-to-date ex-showroom and on-road prices for Nepal market
              </p>
            </div>
            <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f]">EMI Calculator</h3>
              <p className="text-sm text-[#6e6e73] mt-2">
                Calculate monthly payments with real Nepal bank rates
              </p>
            </div>
            <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f]">Expert Guides</h3>
              <p className="text-sm text-[#6e6e73] mt-2">
                In-depth buying guides written for the Nepal market
              </p>
            </div>
            <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f]">Showroom Finder</h3>
              <p className="text-sm text-[#6e6e73] mt-2">
                Find authorized dealers near you across Nepal
              </p>
            </div>
            <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f]">EV Coverage</h3>
              <p className="text-sm text-[#6e6e73] mt-2">
                Comprehensive coverage of electric vehicles available in Nepal
              </p>
            </div>
            <div className="bg-white border border-[#d2d2d7] rounded-2xl p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f]">Price Alerts</h3>
              <p className="text-sm text-[#6e6e73] mt-2">
                Get notified when prices drop on cars you're watching
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center text-[#1d1d1f] mb-4">
          Built in Nepal, for Nepal
        </h2>
        <p className="text-sm text-[#6e6e73] text-center max-w-2xl mx-auto">
          A small team passionate about making car buying easier for every Nepali.
        </p>
        
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-[#f5f5f7] rounded-2xl p-10 text-center">
            <div className="w-20 h-20 bg-[#e8531a] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">CK</span>
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">CarKinne Team</h3>
            <p className="text-sm text-[#6e6e73]">Nepal Car Data & Guides</p>
            <p className="text-xs text-[#6e6e73] mt-3 leading-relaxed">
              We are a team of car enthusiasts and tech builders based in Kathmandu, dedicated to making Nepal's car market more transparent.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="w-full bg-[#1d1d1f] py-15 px-6">
        <div className="max-w-3xl mx-auto text-center py-15">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-sm text-[#a0a0a0] max-w-2xl mx-auto">
            Questions, feedback or partnership? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <a 
              href="mailto:hello@carkinne.com" 
              className="bg-white text-[#1d1d1f] px-8 py-3.5 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Email Us
            </a>
            <a 
              href="/advertise" 
              className="bg-[#e8531a] text-white px-8 py-3.5 rounded-xl font-medium hover:bg-[#e8531a]/90 transition-colors"
            >
              Advertise With Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;