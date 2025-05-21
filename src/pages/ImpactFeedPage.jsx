import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaFilter, FaSearch, FaUserCircle, FaHospital, FaHome, FaGraduationCap, FaHandHoldingHeart, FaShieldAlt, FaDollarSign, FaUsers } from 'react-icons/fa';
import Button from '../components/common/Button';

const ImpactFeedPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnonymizedData, setShowAnonymizedData] = useState(true);

  // Enhanced dummy data
  const impactPosts = [
    {
      id: 1,
      type: 'initiative',
      name: 'Medical Aid Initiative',
      anonymizedName: 'Initiative #M123',
      category: 'medical',
      content: 'Successfully provided medical supplies to 50 families this week. Your donations helped us purchase essential medications and first aid kits.',
      image: 'medical-supplies.jpg',
      date: '2024-02-20',
      likes: 245,
      comments: 18,
      verified: true,
      recentTips: [
        { donor: 'Alex S.', amount: 50, message: 'Keep up the great work!' },
        { donor: 'Anonymous', amount: 100, message: null },
      ],
      totalReceived: 12450,
      beneficiaries: 50
    },
    {
      id: 2,
      type: 'family',
      name: 'Ahmed Family',
      category: 'family',
      content: 'Thanks to your support, we were able to receive necessary food supplies and medical care for our children.',
      date: '2024-02-19',
      likes: 156,
      comments: 12,
      verified: true
    },
    // Add more posts as needed
  ];

  // Add real-time tracker data
  const trackerStats = {
    todayDonations: 2850,
    weeklyDonations: 15670,
    activeDonors: 89,
    familiesHelped: 34
  };

  const categories = [
    { id: 'all', label: 'All Updates', icon: FaHome },
    { id: 'medical', label: 'Medical Aid', icon: FaHospital },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
    { id: 'family', label: 'Family Updates', icon: FaUserCircle },
  ];

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Feed</h1>
          <p className="text-gray-600">Track real-time updates from families and initiatives</p>
        </motion.div>

        {/* Enhanced Real-time Donation Tracker */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaHandHoldingHeart className="text-3xl text-black" />
              <h2 className="text-xl font-bold text-gray-900">Real-time Impact Tracker</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black">Live Updates</span>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FaDollarSign, label: "Today's Donations", value: `$${trackerStats.todayDonations.toLocaleString()}` },
              { icon: FaUsers, label: "Active Donors", value: trackerStats.activeDonors },
              { icon: FaHandHoldingHeart, label: "Weekly Impact", value: `$${trackerStats.weeklyDonations.toLocaleString()}` },
              { icon: FaHome, label: "Families Helped", value: trackerStats.familiesHelped }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100"
              >
                <div className="flex flex-col items-center">
                  <stat.icon className="text-2xl text-black mb-2" />
                  <div className="text-2xl font-bold text-black">{stat.value}</div>
                  <div className="text-sm text-gray-600 text-center">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Privacy Toggle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-end mb-4 gap-2"
        >
          <FaShieldAlt className="text-black" />
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={showAnonymizedData}
              onChange={(e) => setShowAnonymizedData(e.target.checked)}
              className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-blue-500"
            />
            Protect Identity (Show Anonymized Data)
          </label>
        </motion.div>

        {/* Enhanced Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-blue-100"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? 'primary' : 'outline'}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeFilter === category.id 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'border border-gray-200 hover:border-blue-500 hover:text-black'
                  }`}
                >
                  <category.icon />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Impact Posts Grid */}
        <AnimatePresence>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {impactPosts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Post Header */}
                <div className="p-4 border-b border-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {post.type === 'initiative' ? (
                          <FaHospital className="text-2xl text-black" />
                        ) : (
                          <FaUserCircle className="text-2xl text-black" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {showAnonymizedData && post.anonymizedName ? post.anonymizedName : post.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(post.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {post.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <FaShieldAlt /> Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Recent Tips Section */}
                {post.recentTips && post.recentTips.length > 0 && (
                  <div className="p-4 bg-primary-50">
                    <h4 className="font-semibold text-gray-900 mb-2">Recent Support</h4>
                    {post.recentTips.map((tip, i) => (
                      <div key={i} className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">{tip.donor}</span>
                        <span className="font-semibold text-primary-600">${tip.amount}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  {post.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={post.image}
                        alt="Impact"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {/* Interaction Buttons */}
                  <div className="flex items-center gap-6 pt-4 border-t">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                      <FaHeart />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                      <FaComment />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                      <FaShare />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Enhanced Impact Stats */}
                <div className="bg-gray-50 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        ${post.totalReceived?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Received</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {post.beneficiaries}
                      </div>
                      <div className="text-sm text-gray-600">
                        {post.type === 'initiative' ? 'Families Helped' : 'Family Members'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Load More Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8"
        >
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3 text-black border-blue-600 hover:bg-blue-50"
          >
            Load More Updates
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ImpactFeedPage;