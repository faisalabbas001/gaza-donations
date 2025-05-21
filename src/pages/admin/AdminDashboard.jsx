import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers, FaHandHoldingHeart, FaDonate, FaChartLine,
  FaUserShield, FaMoneyBillWave, FaExclamationTriangle,
  FaCheckCircle, FaCalendarCheck, FaDownload
} from 'react-icons/fa';
import Sidebar from '../../components/admin/Sidebar';
import Button from '../../components/common/Button';
import Stats from '../../components/admin/Stats';

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('weekly');

  const statsData = [
    { 
      label: 'Total Donations',
      value: '$523,678',
      change: 12.5,
      iconType: 'donations',
      color: 'bg-green-500'
    },
    { 
      label: 'Active Initiatives',
      value: '24',
      change: 3,
      iconType: 'initiatives',
      color: 'bg-blue-500'
    },
    { 
      label: 'Registered Families',
      value: '156',
      change: 8,
      iconType: 'users',
      color: 'bg-purple-500'
    },
    { 
      label: 'Success Rate',
      value: '98.5%',
      change: 0.5,
      iconType: 'chart',
      color: 'bg-indigo-500'
    }
  ];

  const urgentCases = [
    {
      id: 1,
      title: "Medical Emergency Aid",
      type: "Family",
      priority: "High",
      required: "$5,000",
      received: "$2,340",
      deadline: "2 days"
    },
    // Add more urgent cases...
  ];

  const recentDonations = [
    {
      id: 1,
      donor: "Anonymous",
      amount: "$1,000",
      initiative: "Children's Education",
      status: "completed",
      date: "2024-02-20"
    },
    // Add more donations...
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1  p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600">Monitor and manage donation activities</p>
          </div>
          
          <div className="flex gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <FaDownload /> Export Report
            </Button>
          </div>
        </div>

        <Stats stats={statsData} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Urgent Cases Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaExclamationTriangle className="text-orange-500" />
                Urgent Cases
              </h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            
            <div className="space-y-4">
              {urgentCases.map((case_) => (
                <motion.div
                  key={case_.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{case_.title}</h3>
                      <p className="text-sm text-gray-500">Type: {case_.type}</p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {case_.deadline} left
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {case_.received} of {case_.required}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(parseInt(case_.received.replace(/\D/g, '')) / 
                                    parseInt(case_.required.replace(/\D/g, ''))) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Donations Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />
                Recent Donations
              </h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            
            <div className="space-y-4">
              {recentDonations.map((donation) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{donation.donor}</p>
                    <p className="text-sm text-gray-500">{donation.initiative}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{donation.amount}</p>
                    <p className="text-xs text-gray-500">{donation.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Distribution Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaUserShield className="text-indigo-500" />
                Distribution Overview
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Initiatives (60%)</span>
                  <span>$314,206</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Direct Family Aid (40%)</span>
                  <span>$209,472</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaCalendarCheck className="text-blue-500" />
                Upcoming Tasks
              </h2>
            </div>
            
            <div className="space-y-4">
              {[
                { task: "Review 5 new family applications", deadline: "Today" },
                { task: "Distribute monthly aid packages", deadline: "Tomorrow" },
                { task: "Update initiative progress reports", deadline: "In 2 days" }
              ].map((task, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded text-primary-600" />
                    <span>{task.task}</span>
                  </div>
                  <span className="text-sm text-gray-500">{task.deadline}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;