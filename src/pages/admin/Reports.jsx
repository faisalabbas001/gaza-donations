import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaDownload, 
  FaFilter, 
  FaChartLine, 
  FaDonate, 
  FaUsers, 
  FaHandHoldingHeart 
} from 'react-icons/fa';
import DataTable from '../../components/admin/DataTable';

const Reports = () => {
  const [dateRange, setDateRange] = useState('monthly');
  const [reportType, setReportType] = useState('donations');

  // Mock data for demonstration
  const donationStats = {
    totalAmount: '$523,678',
    averageDonation: '$275',
    topDonation: '$5,000',
    successRate: '98.5%'
  };

  const reports = [
    {
      id: 1,
      type: 'Donation Report',
      date: '2024-02-20',
      amount: '$12,345',
      status: 'completed'
    },
    {
      id: 2,
      type: 'Family Aid Distribution',
      date: '2024-02-19',
      amount: '$8,750',
      status: 'completed'
    },
    {
      id: 3,
      type: 'Initiative Progress',
      date: '2024-02-18',
      amount: '$15,200',
      status: 'pending'
    }
  ];

  const columns = [
    { field: 'type', label: 'Report Type' },
    { field: 'date', label: 'Date' },
    { 
      field: 'amount', 
      label: 'Amount',
      render: (amount) => amount
    },
    {
      field: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${status === 'completed' ? 'bg-green-100 text-green-800' : 
            'bg-yellow-100 text-yellow-800'}`
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and analyze donation reports</p>
        </div>

        <div className="flex gap-3">
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

          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <FaDownload className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Donations', value: donationStats.totalAmount, icon: FaDonate, color: 'bg-green-500' },
          { label: 'Average Donation', value: donationStats.averageDonation, icon: FaChartLine, color: 'bg-blue-500' },
          { label: 'Highest Donation', value: donationStats.topDonation, icon: FaUsers, color: 'bg-purple-500' },
          { label: 'Success Rate', value: donationStats.successRate, icon: FaHandHoldingHeart, color: 'bg-indigo-500' }
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
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Generate Reports</h2>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <FaFilter className="mr-2" />
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {['donations', 'families', 'initiatives'].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`p-4 rounded-lg border text-left transition-colors
                ${reportType === type 
                  ? 'border-primary-600 bg-primary-50 text-primary-600' 
                  : 'hover:bg-gray-50'
                }`
              }
            >
              <h3 className="font-medium capitalize">{type} Report</h3>
              <p className="text-sm text-gray-500 mt-1">
                View detailed {type} analytics
              </p>
            </button>
          ))}
        </div>

        {/* Reports Table */}
        <DataTable
          columns={columns}
          data={reports}
          onSort={(field) => console.log('Sort by:', field)}
        />
      </div>

      {/* Download Options */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Download Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { format: 'PDF', desc: 'Detailed report with charts' },
            { format: 'Excel', desc: 'Raw data spreadsheet' },
            { format: 'CSV', desc: 'Simple data export' }
          ].map((option) => (
            <button
              key={option.format}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div>
                <h3 className="font-medium">{option.format}</h3>
                <p className="text-sm text-gray-500">{option.desc}</p>
              </div>
              <FaDownload className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;