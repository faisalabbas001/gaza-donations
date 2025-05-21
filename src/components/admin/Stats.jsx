import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaHandHoldingHeart, 
  FaDonate, 
  FaChartLine 
} from 'react-icons/fa';

// Create an icon map
const iconMap = {
  users: FaUsers,
  initiatives: FaHandHoldingHeart,
  donations: FaDonate,
  chart: FaChartLine
};

const Stats = ({ stats }) => {
  if (!stats || !Array.isArray(stats)) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        // Get icon from map or use a default
        const Icon = stat.iconType ? iconMap[stat.iconType] : FaChartLine;
        
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
                {stat.change && (
                  <p className={`text-sm mt-1 ${
                    stat.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </p>
                )}
              </div>
              <div className={`${stat.color || 'bg-primary-100'} p-3 rounded-lg text-white`}>
                <Icon className="text-xl" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Stats;