
import React, { useMemo, useState } from 'react';
import { Complaint, User, ComplaintCategory, ComplaintPriority, ComplaintStatus } from '../types';
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from '../constants';
import ComplaintList from './ComplaintList';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserGroupIcon, ClockIcon, ClipboardDocumentListIcon, CheckCircleIcon, SearchIcon } from './icons/Icons';

interface AdminDashboardProps {
  allComplaints: Complaint[];
  allUsers: User[];
  onUpdateComplaint: (updatedComplaint: Complaint) => void;
  currentUser: User;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ allComplaints, allUsers, onUpdateComplaint, currentUser }) => {
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

  const stats = useMemo(() => {
    const resolvedComplaints = allComplaints.filter(c => c.status === 'Resolved');
    const totalResolutionTime = resolvedComplaints.reduce((acc, c) => {
      const resolutionEvent = c.timeline.find(t => t.action === 'Resolution');
      if (resolutionEvent) {
        return acc + (resolutionEvent.timestamp.getTime() - c.createdAt.getTime());
      }
      return acc;
    }, 0);
    const avgResolutionTime = resolvedComplaints.length > 0 ? totalResolutionTime / resolvedComplaints.length : 0;
    const avgResolutionHours = avgResolutionTime / (1000 * 60 * 60);

    const categoryCounts = allComplaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<ComplaintCategory, number>);

    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
    const statusCounts = allComplaints.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);


    return {
      totalComplaints: allComplaints.length,
      resolvedComplaints: resolvedComplaints.length,
      avgResolutionHours: avgResolutionHours.toFixed(2),
      totalStudents: allUsers.filter(u => u.role === 'student').length,
      categoryData,
      statusCounts,
    };
  }, [allComplaints, allUsers]);

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
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Dashboard</h2>
      
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<ClipboardDocumentListIcon />} title="Total Complaints" value={stats.totalComplaints} />
            <StatCard icon={<CheckCircleIcon />} title="Resolved Complaints" value={stats.resolvedComplaints} />
            <StatCard icon={<ClockIcon />} title="Avg. Resolution Time" value={`${stats.avgResolutionHours} hrs`} />
            <StatCard icon={<UserGroupIcon />} title="Total Students" value={stats.totalStudents} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Complaints by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.categoryData}>
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                        <Legend />
                        <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Complaints by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={Object.entries(stats.statusCounts).map(([name, value]) => ({name, value}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {Object.entries(stats.statusCounts).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      <div>
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Complaint Management</h3>
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
        <ComplaintList complaints={filteredComplaints} userRole="admin" onUpdateComplaint={onUpdateComplaint} currentUser={currentUser} />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number }> = ({ icon, title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full text-blue-600 dark:text-blue-400">
      {React.cloneElement(icon as React.ReactElement, { className: "h-7 w-7"})}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
