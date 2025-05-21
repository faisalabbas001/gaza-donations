import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTags } from 'react-icons/fa';
import Sidebar from '../../components/admin/Sidebar';
import DataTable from '../../components/admin/DataTable';
import ActionModal from '../../components/admin/ActionModal';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Education', slug: 'education', count: 15, status: 'active' },
    { id: 2, name: 'Healthcare', slug: 'healthcare', count: 8, status: 'active' },
    { id: 3, name: 'Food Aid', slug: 'food-aid', count: 12, status: 'active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', status: 'active' });

  const columns = [
    { field: 'name', label: 'Category Name' },
    { field: 'slug', label: 'Slug' },
    { field: 'count', label: 'Initiatives' },
    { 
      field: 'status', 
      label: 'Status',
      render: (status) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? { ...cat, ...formData } : cat
      ));
    } else {
      setCategories([...categories, { id: Date.now(), count: 0, ...formData }]);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', status: 'active' });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      status: category.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== category.id));
    }
  };

  return (
    <div className="space-y-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-600">Manage initiative categories</p>
          </div>
          
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', slug: '', status: 'active' });
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FaPlus className="mr-2" />
            Add Category
          </button>
        </div>

        <DataTable
          columns={columns}
          data={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ActionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
          title={editingCategory ? 'Edit Category' : 'Add New Category'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
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
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                {editingCategory ? 'Update' : 'Create'} Category
              </button>
            </div>
          </form>
        </ActionModal>
      </div>

  );
};

export default Categories;