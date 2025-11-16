
import React, { useState, useMemo } from 'react';
import { User, Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from '../types';
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from '../constants';
import ComplaintList from './ComplaintList';
import { FilterIcon, SearchIcon } from './icons/Icons';

interface StaffDashboardProps {
  user: User;
  allComplaints: Complaint[];
  onUpdateComplaint: (updatedComplaint: Complaint) => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, allComplaints, onUpdateComplaint }) => {
  const [filters, setFilters] = useState<{
    category: ComplaintCategory | 'All';
    priority: ComplaintPriority | 'All';
    status: ComplaintStatus | 'All';
    campus: string | 'All';
    searchTerm: string;
  }>({
    category: 'All',
    priority: 'All',
    status: 'All',
    campus: 'All',
    searchTerm: ''
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredComplaints = useMemo(() => {
    return allComplaints.filter(c => {
      const searchMatch = c.studentName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          c._id.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return (
        (filters.category === 'All' || c.category === filters.category) &&
        (filters.priority === 'All' || c.priority === filters.priority) &&
        (filters.status === 'All' || c.status === filters.status) &&
        (filters.campus === 'All' || c.studentCampus === filters.campus) &&
        searchMatch
      );
    });
  }, [allComplaints, filters]);
  
  const campuses = useMemo(() => ['All', ...Array.from(new Set(allComplaints.map(c => c.studentCampus)))], [allComplaints]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Complaint Dashboard</h2>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Search</label>
            <SearchIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400"/>
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Student, ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Category</label>
            <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Categories</option>
              {COMPLAINT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Priority</label>
            <select id="priority" name="priority" value={filters.priority} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Priorities</option>
              {COMPLAINT_PRIORITIES.map(pri => <option key={pri} value={pri}>{pri}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Status</label>
            <select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Statuses</option>
              {COMPLAINT_STATUSES.map(stat => <option key={stat} value={stat}>{stat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="campus" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Campus</label>
            <select id="campus" name="campus" value={filters.campus} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {campuses.map(campus => <option key={campus} value={campus}>{campus}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      <ComplaintList complaints={filteredComplaints} userRole="staff" onUpdateComplaint={onUpdateComplaint} currentUser={user} />
    </div>
  );
};

export default StaffDashboard;
