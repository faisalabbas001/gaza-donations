import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/admin/Sidebar';
import { FaUsers, FaHandHoldingHeart, FaDonate, FaUserPlus } from 'react-icons/fa';

const Dashboard = () => {
  // Mock statistics - replace with real data
  const stats = [
    { label: 'Total Families', value: '156', icon: FaUsers, color: 'bg-blue-500' },
    { label: 'Active Initiatives', value: '23', icon: FaHandHoldingHeart, color: 'bg-green-500' },
    { label: 'Total Donations', value: '$45,250', icon: FaDonate, color: 'bg-purple-500' },
    { label: 'New Applications', value: '12', icon: FaUserPlus, color: 'bg-orange-500' },
  ];

  // Mock recent activities
  const recentActivities = [
    { type: 'family_added', name: 'Ahmad Family', date: '2024-02-20' },
    { type: 'donation_received', amount: '$500', initiative: 'Education Fund', date: '2024-02-19' },
    { type: 'initiative_updated', name: 'Healthcare Program', date: '2024-02-18' },
  ];

  return (
    
      <div className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, Admin</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <Icon className="text-xl" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-lg
                    ${activity.type === 'family_added' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'donation_received' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'}
                  `}>
                    {activity.type === 'family_added' ? <FaUsers /> :
                     activity.type === 'donation_received' ? <FaDonate /> :
                     <FaHandHoldingHeart />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {activity.type === 'donation_received' 
                        ? `New donation of ${activity.amount} received for ${activity.initiative}`
                        : `${activity.name} ${activity.type === 'family_added' ? 'added to database' : 'updated'}`
                      }
                    </p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
  
  );
};

export default Dashboard;