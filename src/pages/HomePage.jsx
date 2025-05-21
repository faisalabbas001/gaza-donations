import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-32 overflow-hidden" style={{ backgroundImage: "url('/bannernew.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
    
        {/* Left side overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-800/50 to-transparent"></div>
        
        {/* Right side overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-blue-950/90 via-blue-800/50 to-transparent"></div>

       
        <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              GiveGaza: Be the Lifeline 
              <span className="block mt-2">Gazans Need</span>
            </h1>
            <p className="text-2xl md:text-3xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A transparent, fee-free platform ensuring 100% of donations reach families in need
            </p>
            <div className="flex gap-6  flex-wrap justify-center">
              <Link to="/donate">
                <Button 
                  variant="light" 
                  size="xl" 
                  className="text-xl px-12 py-4 bg-white hover:bg-gray-100 text-gray-900 shadow-lg hover:shadow-xl transition-all"
                >
                  Donate Now
                </Button>
              </Link>
              <Link to="/apply">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="text-xl px-12 py-4 text-white border-2 border-white/70 hover:bg-white/10 transition-all"
                >
                  Apply for Support

                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 bg-white">
        {/* Top curved shape */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320" 
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: '120px', marginTop: '-120px' }}
          >
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Transparent Donation',
                description: 'Make secure crypto donations with 100% reaching beneficiaries',
                icon: '💝'
              },
              {
                title: 'Smart Distribution',
                description: 'Automated threshold-based disbursement to verified recipients',
                icon: '🔄'
              },
              {
                title: 'Real-Time Impact',
                description: 'Track your contribution with blockchain verification',
                icon: '📊'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Status Section - Updated styling */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            {[
              { label: 'Total Donated', value: '$123,456' },
              { label: 'Families Helped', value: '1,234' },
              { label: 'Active Initiatives', value: '45' },
              { label: 'Success Rate', value: '98%' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl font-bold text-primary-600 mb-3">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Donors Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Making a difference has never been more transparent.",
                author: "Anonymous Donor",
                image: "/profile.png",
                role: "Monthly Contributor"
              },
              {
                quote: "I can see exactly how my donation helps families.",
                author: "Regular Contributor",
                image: "/profile.png",
                role: "Volunteer & Donor"
              },
              {
                quote: "Simple, secure, and impactful giving platform.",
                author: "Tech Donor",
                image: "/profile.png",
                role: "Tech Ambassador"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-full h-full object-cover rounded-full ring-4 ring-gray-100"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                      <span className="text-xl">❝</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{testimonial.author}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-lg mb-4 text-gray-700 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center mt-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">
            Join us in supporting families and initiatives in Gaza
          </p>
          <Link to="/donate">
          
          <button className="bg-blue-500  text-white cursor-pointer px-12 py-4 rounded-full text-xl font-bold  transition-all">
            Donate Now
          </button>
          
          </Link>
        </div>
      </section>

      {/* Add Partners Section */}
      <section className="py-24 bg-gradient-to-b  text-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Trusted Partners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Working together with established organizations to ensure transparent and effective aid distribution
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className=" rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 mb-6 relative">
                  <img 
                    src="/child.png" 
                    alt="Funds for Gaza Initiative" 
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute inset-0 bg-primary-500/10 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4">Funds for Gaza Initiative</h3>
                <p className="text-gray-600 text-center mb-6">
                  Leading humanitarian organization with established presence in Gaza, ensuring effective aid distribution
                </p>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                    Verified Partner
                  </span>
                  <span className="px-4 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Template for additional partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-dashed border-gray-200 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-500">Future Partner Slot</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-dashed border-gray-200 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-500">Future Partner Slot</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-600">
              Interested in partnering with GiveGaza? 
              <Link to="/contact" className="text-primary-600 hover:text-primary-700 ml-2 font-medium">
                Contact us
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 