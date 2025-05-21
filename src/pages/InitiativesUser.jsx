import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaGraduationCap, FaHeart, FaHandHoldingHeart, FaLeaf, FaSortAmountDown, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const categories = [
  { id: 'education', name: 'Education', icon: FaGraduationCap },
  { id: 'healthcare', name: 'Healthcare', icon: FaHeart },
  { id: 'relief', name: 'Relief', icon: FaHandHoldingHeart },
  { id: 'environment', name: 'Environment', icon: FaLeaf },
];

const sortOptions = [
  { id: 'newest', name: 'Newest First' },
  { id: 'largest', name: 'Largest Impact' },
  { id: 'ending', name: 'Ending Soon' },
];

// Mock data - replace with API call
const initiatives = [
  {
    id: 1,
    title: "Children's Education Program",
    category: "education",
    description: "Supporting underprivileged children with quality education and resources. Providing books, school supplies, and learning materials.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
    progress: 37500,
    target: 50000,
    daysLeft: 15,
    partner: "Education For All Foundation",
    supporters: 234
  },
  {
    id: 2,
    title: "Healthcare for Communities",
    category: "healthcare",
    description: "Bringing essential medical services to underserved communities. Mobile clinics and preventive care programs.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
    progress: 28000,
    target: 40000,
    daysLeft: 21,
    partner: "Global Health Initiative",
    supporters: 156
  },
  {
    id: 3,
    title: "Emergency Relief Fund",
    category: "relief",
    description: "Providing immediate assistance to families affected by natural disasters. Food, shelter, and essential supplies.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
    progress: 89000,
    target: 100000,
    daysLeft: 7,
    partner: "Rapid Response Team",
    supporters: 445
  },
  {
    id: 4,
    title: "Green Earth Initiative",
    category: "environment",
    description: "Planting trees and protecting local ecosystems. Community-led environmental conservation projects.",
    image: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=800&auto=format&fit=crop",
    progress: 15000,
    target: 30000,
    daysLeft: 45,
    partner: "EcoGuardians",
    supporters: 189
  },
  {
    id: 5,
    title: "Youth Skills Development",
    category: "education",
    description: "Training young adults in digital skills and entrepreneurship. Career guidance and mentorship programs.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    progress: 42000,
    target: 60000,
    daysLeft: 30,
    partner: "Future Leaders Academy",
    supporters: 278
  },
  {
    id: 6,
    title: "Community Health Center",
    category: "healthcare",
    description: "Building a permanent healthcare facility for rural communities. Medical equipment and staff training.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop",
    progress: 125000,
    target: 200000,
    daysLeft: 60,
    partner: "Healthcare Access Foundation",
    supporters: 567
  }
];

// Add this search filter function
const filterInitiatives = (initiatives, searchQuery, selectedCategories) => {
  return initiatives.filter(initiative => {
    const matchesSearch = searchQuery === '' || 
      initiative.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      initiative.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      initiative.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(initiative.category);

    return matchesSearch && matchesCategory;
  });
};

const InitiativesUser = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 6;

  // Create ref and inView for infinite scroll
  const { ref: loadingRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreInitiatives();
    }
  }, [inView]);

  const loadMoreInitiatives = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
      // Check if we've reached the end
      if (currentPage * itemsPerPage >= initiatives.length) {
        setHasMore(false);
      }
    }, 1000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const filterVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3 }
      }
    }
  };

  const InitiativeCard = ({ initiative, index }) => {
    return (
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <Link to={`/initiatives/${initiative.id}`} state={{ initiative: initiative }}>
          <div className="relative overflow-hidden">
            <img 
              src={initiative.image} 
              alt={initiative.title}
              className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium">
                {initiative.category}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{initiative.title}</h3>
            <p className="text-gray-600 mb-4">{initiative.description}</p>
            
            {/* Partner Name */}
            <div className="text-sm text-blue-600">
              {initiative.partner}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  // Add this to filter initiatives based on search and categories
  const filteredInitiatives = filterInitiatives(initiatives, searchQuery, selectedCategories);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInitiatives = filteredInitiatives.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInitiatives.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get visible page numbers
  const getVisiblePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header with parallax effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          <motion.h1 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Make an Impact Today
          </motion.h1>
          <motion.p 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Browse our curated initiatives and join us in creating positive change in communities worldwide.
          </motion.p>
        </motion.div>

        {/* Enhanced Search and Filter Bar */}
        <div className="mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search initiatives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
              />
            </div>
            
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-6 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                <FaFilter className="mr-2" />
                Filters
                <motion.div
                  animate={{ rotate: isFilterOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown className="ml-2" />
                </motion.div>
              </motion.button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Animated Category Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="w-full overflow-hidden bg-white rounded-xl shadow-lg border border-gray-200 mt-4"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
                  <div className="flex flex-wrap gap-4">
                    {categories.map(category => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedCategories(prev =>
                            prev.includes(category.id)
                              ? prev.filter(id => id !== category.id)
                              : [...prev, category.id]
                          );
                        }}
                        className={`
                          flex items-center px-6 py-3 rounded-lg transition-all duration-300
                          whitespace-nowrap text-base
                          ${selectedCategories.includes(category.id)
                            ? 'bg-primary-600 text-black shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }
                        `}
                      >
                        <category.icon className="mr-3 text-lg" />
                        <span className="font-medium">{category.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Initiatives Grid with Infinite Scroll */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {currentInitiatives.map((initiative, index) => (
            <InitiativeCard key={initiative.id} initiative={initiative} index={index} />
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center space-x-2 mt-12"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              {getVisiblePageNumbers().map((number, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => typeof number === 'number' && handlePageChange(number)}
                  className={`
                    w-10 h-10 rounded-lg transition-colors duration-200
                    ${number === currentPage
                      ? 'bg-primary-600 text-white'
                      : number === '...'
                      ? 'cursor-default'
                      : 'hover:bg-gray-100'
                    }
                    ${typeof number !== 'number' ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  {number}
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 mt-6"
        >
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInitiatives.length)} of {filteredInitiatives.length} initiatives
        </motion.p>
      </motion.div>
    </div>
  );
};

export default InitiativesUser;