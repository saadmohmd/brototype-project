
import React, { useState } from 'react';
import { Complaint, User, UserRole, ComplaintStatus, TimelineEvent } from '../types';
import { COMPLAINT_STATUSES } from '../constants';
import Badge from './Badge';
import { XMarkIcon, PaperClipIcon, ChatBubbleLeftRightIcon, ArrowPathIcon } from './icons/Icons';

interface ComplaintDetailModalProps {
  complaint: Complaint;
  onClose: () => void;
  userRole: UserRole;
  onUpdate: (updatedComplaint: Complaint) => void;
  currentUser?: User;
}

const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ complaint, onClose, userRole, onUpdate, currentUser }) => {
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint.status);
  
  const handleUpdate = () => {
    let updatedComplaint = { ...complaint };
    const newTimelineEvents: TimelineEvent[] = [];

    if(newStatus !== complaint.status) {
        const actionMessage = newStatus === 'Resolved' ? 'Resolution' : 'Status Update';
        newTimelineEvents.push({
            action: actionMessage,
            message: `Status changed to ${newStatus}. ${newStatus === 'Resolved' && newNote ? `Resolution note: ${newNote}` : ''}`,
            responderId: currentUser?._id,
            timestamp: new Date()
        });
        if(newStatus === 'Resolved' && newNote) setNewNote(''); // clear note if used in resolution
    }

    if(newNote.trim() !== '') {
        newTimelineEvents.push({
            action: 'Note Added',
            message: newNote,
            responderId: currentUser?._id,
            timestamp: new Date()
        });
    }
    
    if (newTimelineEvents.length > 0) {
        updatedComplaint.timeline = [...newTimelineEvents, ...complaint.timeline];
        updatedComplaint.status = newStatus;
        updatedComplaint.updatedAt = new Date();
        onUpdate(updatedComplaint);
    }
    setNewNote('');
    // No need to close modal, user might want to see the update.
    // onClose(); 
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Complaint Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div><strong className="text-gray-600 dark:text-gray-300">ID:</strong> <span className="text-gray-800 dark:text-gray-100">{complaint._id}</span></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Student:</strong> <span className="text-gray-800 dark:text-gray-100">{complaint.studentName}</span></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Category:</strong> <span className="text-gray-800 dark:text-gray-100">{complaint.category}</span></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Campus:</strong> <span className="text-gray-800 dark:text-gray-100">{complaint.studentCampus}</span></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Priority:</strong> <Badge type="priority" value={complaint.priority} /></div>
            <div><strong className="text-gray-600 dark:text-gray-300">Status:</strong> <Badge type="status" value={complaint.status} /></div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Description</h4>
            <p className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">{complaint.description}</p>
          </div>

          {complaint.attachmentURL && (
            <div className="mb-6">
              <a href={complaint.attachmentURL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:underline">
                <PaperClipIcon className="h-5 w-5 mr-2" /> View Attachment
              </a>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Timeline</h4>
            <div className="space-y-4">
              {complaint.timeline.map((event, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{event.action}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{event.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {userRole === 'admin' && complaint.status !== 'Resolved' && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Update Complaint</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Change Status</label>
                <select
                  id="newStatus"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {COMPLAINT_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="newNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Note</label>
                <textarea
                  id="newNote"
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add an internal note or resolution details..."
                  className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleUpdate}
                  className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2"/>
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailModal;