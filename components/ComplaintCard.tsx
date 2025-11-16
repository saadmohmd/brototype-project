
import React from 'react';
import { Complaint } from '../types';
import Badge from './Badge';
import { CalendarIcon, TagIcon, UserCircleIcon } from './icons/Icons';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick: () => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onClick }) => {
  const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-transparent hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-wrap gap-2">
            <Badge type="status" value={complaint.status} />
            <Badge type="priority" value={complaint.priority} />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-2">
          <TagIcon className="h-4 w-4 mr-1.5" />
          {complaint.category}
        </p>
        <p className="font-semibold text-gray-800 dark:text-white truncate" title={complaint.description}>
          {complaint.description}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
            <UserCircleIcon className="h-4 w-4 mr-1.5" />
            <span>{complaint.studentName}</span>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1.5" />
          <span>{timeSince(complaint.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
