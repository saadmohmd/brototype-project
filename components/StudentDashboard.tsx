
import React, { useState } from 'react';
import { User, Complaint } from '../types';
import ComplaintList from './ComplaintList';
import CreateComplaintModal from './CreateComplaintModal';
import { PlusIcon } from './icons/Icons';

interface StudentDashboardProps {
  user: User;
  complaints: Complaint[];
  onAddComplaint: (newComplaint: Complaint) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, complaints, onAddComplaint }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddComplaint = (complaintData: Omit<Complaint, '_id' | 'studentId' | 'studentName' | 'studentCampus' | 'status' | 'timeline' | 'createdAt' | 'updatedAt'>) => {
    const newComplaint: Complaint = {
      _id: `complaint-${Date.now()}`,
      studentId: user._id,
      studentName: user.name,
      studentCampus: user.campus || 'N/A',
      status: 'Submitted',
      timeline: [{ action: 'Complaint Submitted', message: 'Student submitted the complaint.', timestamp: new Date() }],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...complaintData,
    };
    onAddComplaint(newComplaint);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">My Complaints</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Raise Complaint
        </button>
      </div>
      
      <ComplaintList complaints={complaints} userRole="student" onUpdateComplaint={() => {}} />

      {isModalOpen && (
        <CreateComplaintModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddComplaint}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
