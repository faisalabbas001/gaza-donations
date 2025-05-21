import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-gradient-to-r from-primary-700 to-primary-900 text-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About GiveGaza</h1>
            <p className="text-xl md:text-2xl mb-8 ">
              Bridging donors and families through transparent blockchain technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Making a Difference in Gaza</h2>
            <p className="text-center text-gray-600 mb-8">Watch how your support is transforming lives and bringing hope to families in Gaza.</p>
            
            {/* Video Section */}
            <div className="mb-16">
              <div className="relative pt-[56.25%] rounded-xl overflow-hidden shadow-2xl">
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Overlay with gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">Supporting Gaza Communities</h3>
                    <p className="text-sm opacity-80">Every donation makes a difference</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Showcase */}
            
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="mb-6">
              GiveGaza is committed to bridging the gap between donors and families in Gaza by providing a transparent, 
              fee-free platform that ensures 100% of donations directly reach those in need.
            </p>
            <p className="mb-6">
              Through blockchain technology, we enhance accountability, preserve beneficiary dignity, and foster trust 
              with real-time tracking and transparent reporting.
            </p>
            <h2 className="text-3xl font-bold mb-6">How We Work</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Scheduled disbursement system based on verified needs</li>
              <li>Threshold-based distribution using Impact Points</li>
              <li>Monthly status updates and transparent reporting</li>
              <li>Partnership with Funds for Gaza Initiative for verification</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
