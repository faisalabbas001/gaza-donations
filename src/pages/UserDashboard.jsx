import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaUsers, FaChartLine, FaFileAlt, FaCamera, FaEdit, FaBell, FaDownload } from 'react-icons/fa';
import Button from '../components/common/Button';

const UserDashboard = () => {
  // This would come from your auth context in a real app
  const [userType, setUserType] = useState('initiative'); // or 'family'

  // Dummy data
  const initiativeData = {
    name: 'Medical Aid Initiative',
    totalReceived: 25000,
    familiesHelped: 150,
    updates: 12,
    recentUpdates: [
      { id: 1, title: 'Medical Supplies Distribution', date: '2024-02-20', status: 'completed' },
      { id: 2, title: 'Emergency Response Team', date: '2024-02-18', status: 'in-progress' },
    ],
    pendingRequests: 5
  };

  const familyData = {
    name: 'Ahmad Family',
    totalReceived: 2500,
    memberCount: 5,
    updates: 4,
    medicalNeeds: ['Chronic Medication', 'Baby Supplies'],
    nextPayment: '2024-03-01'
  };

  const InitiativeDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Received', value: `$${initiativeData.totalReceived}`, icon: FaWallet },
          { label: 'Families Helped', value: initiativeData.familiesHelped, icon: FaUsers },
          { label: 'Updates Posted', value: initiativeData.updates, icon: FaChartLine },
          { label: 'Pending Requests', value: initiativeData.pendingRequests, icon: FaFileAlt }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="text-2xl text-primary-600" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Post Update Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Post New Update</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Update title"
            className="w-full p-3 border rounded-lg"
          />
          <textarea
            placeholder="Describe your update..."
            rows="4"
            className="w-full p-3 border rounded-lg"
          />
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <FaCamera /> Add Photos
            </Button>
            <Button>Post Update</Button>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Recent Updates</h2>
        <div className="space-y-4">
          {initiativeData.recentUpdates.map((update) => (
            <div key={update.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{update.title}</h3>
                <p className="text-sm text-gray-500">{update.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                update.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {update.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FamilyDashboard = () => (
    <div className="space-y-6">
      {/* Family Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Received', value: `$${familyData.totalReceived}`, icon: FaWallet },
          { label: 'Family Members', value: familyData.memberCount, icon: FaUsers },
          { label: 'Updates Shared', value: familyData.updates, icon: FaChartLine }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="text-2xl text-primary-600" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Medical Needs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Medical Needs</h2>
        <div className="space-y-3">
          {familyData.medicalNeeds.map((need, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>{need}</span>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            <FaEdit className="mr-2" /> Add Medical Need
          </Button>
        </div>
      </div>

      {/* Next Payment */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Next Payment</h2>
        <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
          <div>
            <p className="text-primary-600 font-medium">Expected Payment</p>
            <p className="text-2xl font-bold text-primary-800">{familyData.nextPayment}</p>
          </div>
          <FaBell className="text-2xl text-primary-600" />
        </div>
      </div>

      {/* Share Update */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Share Update</h2>
        <div className="space-y-4">
          <textarea
            placeholder="Share how the support has helped your family..."
            rows="4"
            className="w-full p-3 border rounded-lg"
          />
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <FaCamera /> Add Photo
            </Button>
            <Button>Share Update</Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userType === 'initiative' ? 'Initiative Dashboard' : 'Family Dashboard'}
            </h1>
            <p className="text-gray-600">
              Welcome back, {userType === 'initiative' ? initiativeData.name : familyData.name}
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <FaDownload /> Download Report
            </Button>
            <Button>Update Profile</Button>
          </div>
        </div>

        {/* Render appropriate dashboard based on user type */}
        {userType === 'initiative' ? <InitiativeDashboard /> : <FamilyDashboard />}
      </div>
    </div>
  );
};

export default UserDashboard;