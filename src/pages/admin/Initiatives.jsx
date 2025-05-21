import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import Sidebar from '../../components/admin/Sidebar';
import DataTable from '../../components/admin/DataTable';
import ActionModal from '../../components/admin/ActionModal';
import Stats from '../../components/admin/Stats';

const Initiatives = () => {
  const [initiatives, setInitiatives] = useState([
    {
      id: 1,
      title: "Children's Education Program",
      category: "Education",
      target: 50000,
      raised: 35000,
      status: 'active',
      endDate: '2024-03-15',
    },
    // Add more mock data
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Initiatives', value: '23', change: +8.1 },
    { label: 'Active', value: '18', change: +12.5 },
    { label: 'Total Raised', value: '$125,750', change: +15.2 },
    { label: 'Success Rate', value: '92%', change: +2.4 },
  ];

  const columns = [
    { field: 'title', label: 'Initiative Title' },
    { field: 'category', label: 'Category' },
    { 
      field: 'target', 
      label: 'Target',
      render: (amount) => `$${amount.toLocaleString()}`
    },
    { 
      field: 'raised', 
      label: 'Raised',
      render: (amount) => `$${amount.toLocaleString()}`
    },
    {
      field: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${status === 'active' ? 'bg-green-100 text-green-800' : 
            status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'}`
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    { field: 'endDate', label: 'End Date' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    target: '',
    status: 'pending',
    endDate: '',
    description: '',
  });

  const handleEdit = (initiative) => {
    setEditingInitiative(initiative);
    setFormData({
      title: initiative.title,
      category: initiative.category,
      target: initiative.target,
      status: initiative.status,
      endDate: initiative.endDate,
      description: initiative.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingInitiative) {
      setInitiatives(initiatives.map(init => 
        init.id === editingInitiative.id ? { ...init, ...formData } : init
      ));
    } else {
      setInitiatives([...initiatives, { 
        id: Date.now(), 
        raised: 0,
        ...formData 
      }]);
    }
    setIsModalOpen(false);
    setEditingInitiative(null);
    setFormData({
      title: '',
      category: '',
      target: '',
      status: 'pending',
      endDate: '',
      description: '',
    });
  };

  return (
    <div className="space-y-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Initiatives</h1>
            <p className="text-gray-600">Manage donation initiatives</p>
          </div>
          
          <button
            onClick={() => {
              setEditingInitiative(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FaPlus className="mr-2" />
            Add Initiative
          </button>
        </div>

        <Stats stats={stats} />

        <div className="mt-8 mb-6 flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search initiatives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <FaFilter className="mr-2" />
            Filter
          </button>
        </div>

        <DataTable
          columns={columns}
          data={initiatives.filter(initiative => 
            initiative.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            initiative.category.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          onEdit={handleEdit}
          onDelete={(initiative) => {
            if (window.confirm('Are you sure you want to delete this initiative?')) {
              setInitiatives(initiatives.filter(i => i.id !== initiative.id));
            }
          }}
        />

        <ActionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingInitiative(null);
          }}
          title={editingInitiative ? 'Edit Initiative' : 'Add New Initiative'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initiative Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Food">Food</option>
                <option value="Shelter">Shelter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount ($)
              </label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {editingInitiative ? 'Update' : 'Create'} Initiative
              </button>
            </div>
          </form>
        </ActionModal>
      </div>
    
  );
};

export default Initiatives;