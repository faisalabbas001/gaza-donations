import React from 'react';
import { motion } from 'framer-motion';
import { FaSort, FaEdit, FaTrash } from 'react-icons/fa';

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onSort,
  sortField,
  sortDirection 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => onSort && onSort(column.field)}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>{column.label}</span>
                    {sortField === column.field && (
                      <FaSort className="text-gray-400" />
                    )}
                  </button>
                </th>
              ))}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.field}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                  >
                    {column.render 
                      ? column.render(row[column.field], row)
                      : row[column.field]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => onEdit(row)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;