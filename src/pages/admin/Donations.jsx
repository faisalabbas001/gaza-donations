import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaFilter } from 'react-icons/fa';
import Sidebar from '../../components/admin/Sidebar';
import DataTable from '../../components/admin/DataTable';
import Stats from '../../components/admin/Stats';

const Donations = () => {
  const [donations] = useState([
    {
      id: 1,
      donor: 'John Doe',
      initiative: 'Education Fund',
      amount: 500,
      status: 'completed',
      date: '2024-02-20',
    },
    // Add more mock data
  ]);

  const stats = [
    { label: 'Total Donations', value: '$45,250', change: +12.5 },
    { label: 'This Month', value: '$12,345', change: +8.2 },
    { label: 'Average Donation', value: '$275', change: -2.1 },
    { label: 'Success Rate', value: '98.5%', change: +0.5 },
  ];

  const columns = [
    { field: 'donor', label: 'Donor Name' },
    { field: 'initiative', label: 'Initiative' },
    { 
      field: 'amount', 
      label: 'Amount',
      render: (amount) => `$${amount.toLocaleString()}`
    },
    {
      field: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${status === 'completed' ? 'bg-green-100 text-green-800' : 
            status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'}`
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    { field: 'date', label: 'Date' },
  ];

  return (
    <div className="space-y-6">
      <h1 className='font-bold'>Donations</h1>
        <div className="mt-8 mb-6 flex justify-between items-center">
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <FaFilter className="mr-2" />
            Filter
          </button>

          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <FaDownload className="mr-2" />
            Export Report
          </button>
        </div>

        <DataTable
          columns={columns}
          data={donations}
          onSort={(field) => console.log('Sort by:', field)}
        />
      </div>
  
  );
};

export default Donations;