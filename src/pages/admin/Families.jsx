import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import Sidebar from '../../components/admin/Sidebar';
import DataTable from '../../components/admin/DataTable';
import ActionModal from '../../components/admin/ActionModal';
import Stats from '../../components/admin/Stats';

const Families = () => {
  const [families, setFamilies] = useState([
    {
      id: 1,
      name: 'Ahmad Family',
      members: 5,
      location: 'Gaza City',
      status: 'approved',
      needs: 'Medical, Food',
      dateAdded: '2024-02-15',
    },
    // Add more mock data as needed
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Families', value: '156', change: +5.2 },
    { label: 'Pending Review', value: '12', change: -2.1 },
    { label: 'Approved', value: '134', change: +4.8 },
    { label: 'Need Urgent Help', value: '23', change: -1.5 },
  ];

  const columns = [
    { field: 'name', label: 'Family Name' },
    { field: 'members', label: 'Members' },
    { field: 'location', label: 'Location' },
    { 
      field: 'status', 
      label: 'Status',
      render: (status) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${status === 'approved' ? 'bg-green-100 text-green-800' : 
            status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'}`
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    { field: 'needs', label: 'Needs' },
    { field: 'dateAdded', label: 'Date Added' },
  ];

  const handleEdit = (family) => {
    setEditingFamily(family);
    setFormData({
      name: family.name,
      members: family.members,
      location: family.location,
      needs: family.needs,
      status: family.status,
    });
    setIsModalOpen(true);
  };

  const [formData, setFormData] = useState({
    name: '',
    members: '',
    location: '',
    needs: '',
    status: 'pending',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingFamily) {
      setFamilies(families.map(family => 
        family.id === editingFamily.id ? { ...family, ...formData } : family
      ));
    } else {
      setFamilies([...families, { 
        id: Date.now(), 
        dateAdded: new Date().toISOString().split('T')[0],
        ...formData 
      }]);
    }
    setIsModalOpen(false);
    setEditingFamily(null);
    setFormData({ name: '', members: '', location: '', needs: '', status: 'pending' });
  };

  return (
    <div className="space-y-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Families</h1>
            <p className="text-gray-600">Manage registered families</p>
          </div>
          
          <button
            onClick={() => {
              setEditingFamily(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FaPlus className="mr-2" />
            Add Family
          </button>
        </div>

        <Stats stats={stats} />

        <div className="mt-8 mb-6 flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search families..."
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
          data={families.filter(family => 
            family.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            family.location.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          onEdit={handleEdit}
          onDelete={(family) => {
            if (window.confirm('Are you sure you want to delete this family?')) {
              setFamilies(families.filter(f => f.id !== family.id));
            }
          }}
        />

        <ActionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingFamily(null);
          }}
          title={editingFamily ? 'Edit Family' : 'Add New Family'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Family Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Members
              </label>
              <input
                type="number"
                value={formData.members}
                onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Needs
              </label>
              <input
                type="text"
                value={formData.needs}
                onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
                {editingFamily ? 'Update' : 'Add'} Family
              </button>
            </div>
          </form>
        </ActionModal>
      </div>

  );
};

export default Families;