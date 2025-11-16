
import React, { useState } from 'react';
import { Complaint } from '../types';
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES } from '../constants';
import { XMarkIcon, PaperAirplaneIcon } from './icons/Icons';

interface CreateComplaintModalProps {
  onClose: () => void;
  onSubmit: (data: Omit<Complaint, '_id' | 'studentId' | 'studentName' | 'studentCampus' | 'status' | 'timeline' | 'createdAt' | 'updatedAt'>) => void;
}

const CreateComplaintModal: React.FC<CreateComplaintModalProps> = ({ onClose, onSubmit }) => {
  const [category, setCategory] = useState(COMPLAINT_CATEGORIES[0]);
  const [priority, setPriority] = useState(COMPLAINT_PRIORITIES[0]);
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }
    setError('');
    onSubmit({
      category,
      priority,
      description,
      // In a real app, this would be an uploaded URL from a service like S3
      attachmentURL: attachment ? URL.createObjectURL(attachment) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Raise a New Complaint</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Complaint['category'])}
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {COMPLAINT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Complaint['priority'])}
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {COMPLAINT_PRIORITIES.map(pri => <option key={pri} value={pri}>{pri}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe your issue in detail..."
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div>
              <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachment (Optional)</label>
              <input
                type="file"
                id="attachment"
                onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600"
              />
            </div>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              type="submit"
              className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
              <PaperAirplaneIcon className="h-5 w-5 mr-2"/>
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaintModal;
