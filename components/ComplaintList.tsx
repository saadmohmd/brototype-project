
import React, { useState } from 'react';
import { Complaint, User, UserRole } from '../types';
import ComplaintCard from './ComplaintCard';
import ComplaintDetailModal from './ComplaintDetailModal';

interface ComplaintListProps {
  complaints: Complaint[];
  userRole: UserRole;
  onUpdateComplaint: (updatedComplaint: Complaint) => void;
  currentUser?: User;
}

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, userRole, onUpdateComplaint, currentUser }) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  if (complaints.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No complaints found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {userRole === 'student' ? "You haven't raised any complaints yet." : "No complaints match the current filters."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.map(complaint => (
          <ComplaintCard
            key={complaint._id}
            complaint={complaint}
            onClick={() => setSelectedComplaint(complaint)}
          />
        ))}
      </div>
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          userRole={userRole}
          onUpdate={onUpdateComplaint}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default ComplaintList;
