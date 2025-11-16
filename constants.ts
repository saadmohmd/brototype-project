import { User, Complaint, UserRole } from './types';

export const MOCK_USERS: User[] = [
  { _id: 'student-01', name: 'Arjun Sharma', email: 'arjun.s@brototype.com', password: 'password', role: 'student', batch: 'MEARN-1', campus: 'Kochi', createdAt: new Date('2023-01-15') },
  { _id: 'student-02', name: 'Priya Patel', email: 'priya.p@brototype.com', password: 'password', role: 'student', batch: 'Flutter-3', campus: 'Trivandrum', createdAt: new Date('2023-02-20') },
  { _id: 'admin-01', name: 'Admin User', email: 'admin@brototype.com', password: 'password', role: 'admin', campus: 'HQ', createdAt: new Date('2022-01-01') }
];

export const MOCK_COMPLAINTS: Complaint[] = [];

export const COMPLAINT_CATEGORIES: Complaint['category'][] = ['Hostel', 'Mentor', 'Fee', 'Placement', 'Behaviour', 'Facility', 'Other'];
export const COMPLAINT_PRIORITIES: Complaint['priority'][] = ['Normal', 'Urgent'];
export const COMPLAINT_STATUSES: Complaint['status'][] = ['Submitted', 'In Progress', 'Resolved'];