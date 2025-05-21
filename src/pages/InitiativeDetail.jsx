import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaShare, FaClock, FaUsers, FaArrowLeft } from 'react-icons/fa';

const InitiativeDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const initiative = location.state?.initiative;

  if (!initiative) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Initiative not found</h2>
          <Link to="/initiatives" className="text-primary-600 hover:underline mt-4 block">
            Return to Initiatives
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <Link 
        to="/initiatives"
        className="fixed top-6 left-6 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300"
      >
        <FaArrowLeft className="text-gray-700" />
      </Link>

      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[500px]"
      >
        <img
          src={initiative.image}
          alt={initiative.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-4 py-2 bg-primary-600 rounded-full text-sm font-semibold mb-4">
                {initiative.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{initiative.title}</h1>
              <div className="flex items-center gap-6 text-lg">
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  {initiative.daysLeft} days left
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-2" />
                  {initiative.supporters} supporters
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4">About the Initiative</h2>
              <p className="text-gray-600 leading-relaxed">
                {initiative.description}
              </p>
            </div>
          </div>

          {/* Donation Sidebar */}
          {/* <div className="lg:col-span-1">
            <div className="sticky top-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-semibold">${initiative.progress.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(initiative.progress / initiative.target) * 100}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-green-500"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target</span>
                    <span className="font-semibold">${initiative.target.toLocaleString()}</span>
                  </div>
                </div>

                <button className="w-full bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors mb-4 font-semibold">
                  Donate Now
                </button>

                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-xl hover:bg-gray-50">
                    <FaHeart />
                    Save
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-xl hover:bg-gray-50">
                    <FaShare />
                    Share
                  </button>
                </div>
              </motion.div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InitiativeDetail;
