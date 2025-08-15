'use client'
import React, { useState } from 'react';

const ContentTable = ({ content, onEdit, onDelete, onView }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Sort content
  const sortedContent = [...content].sort((a, b) => {
    if (sortField === 'id') {
      return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
    }
    
    const aValue = a[sortField]?.toString().toLowerCase() || '';
    const bValue = b[sortField]?.toString().toLowerCase() || '';
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Filter content based on search
  const filteredContent = sortedContent.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map(item => item.id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      selectedItems.forEach(id => onDelete(id));
      setSelectedItems([]);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedItems.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              
              {/* ID Column */}
              <th
                onClick={() => handleSort('id')}
                className="px-4 py-3 text-left font-medium text-gray-600 text-sm uppercase tracking-wide cursor-pointer hover:bg-gray-100 select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>

              {/* Title Column */}
              <th
                onClick={() => handleSort('title')}
                className="px-4 py-3 text-left font-medium text-gray-600 text-sm uppercase tracking-wide cursor-pointer hover:bg-gray-100 select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  {getSortIcon('title')}
                </div>
              </th>

              {/* Slug Column */}
              <th
                onClick={() => handleSort('slug')}
                className="px-4 py-3 text-left font-medium text-gray-600 text-sm uppercase tracking-wide cursor-pointer hover:bg-gray-100 select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>Slug</span>
                  {getSortIcon('slug')}
                </div>
              </th>

              {/* Description Column */}
              <th className="px-4 py-3 text-left font-medium text-gray-600 text-sm uppercase tracking-wide">
                Description
              </th>

              {/* Actions Column */}
              <th className="px-4 py-3 text-left font-medium text-gray-600 text-sm uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100">
            {filteredContent.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? (
                    <div>
                      <p>No content found matching &ldquo;{searchTerm}&rdquo;</p>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <p>No content available. Add some content to get started.</p>
                  )}
                </td>
              </tr>
            ) : (
              filteredContent.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedItems.includes(item.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">
                    #{item.id}
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-900">{item.title}</div>
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <span className="text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
                      {item.slug}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                    <div className="truncate" title={item.description}>
                      {truncateText(item.description, 60)}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                          title="View details"
                        >
                          View
                        </button>
                      )}
                      
                      <button
                        onClick={() => onEdit(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        title="Edit content"
                      >
                        Edit
                      </button>
                      
                      <button
                        onClick={() => onDelete(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        title="Delete content"
                      >
                        Delete
                      </button>  
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {filteredContent.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredContent.length} of {content.length} items
              {searchTerm && ` (filtered by &ldquo;${searchTerm}&rdquo;)`}
            </span>
            
            {selectedItems.length > 0 && (
              <span className="text-blue-600">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTable;