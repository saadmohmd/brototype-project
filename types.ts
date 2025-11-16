
export type UserRole = 'student' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  batch?: string;
  campus?: string;
  createdAt: Date;
}

export type ComplaintCategory = 'Hostel' | 'Mentor' | 'Fee' | 'Placement' | 'Behaviour' | 'Facility' | 'Other';
export type ComplaintPriority = 'Normal' | 'Urgent';
export type ComplaintStatus = 'Submitted' | 'In Progress' | 'Resolved';

export interface TimelineEvent {
  action: string;
  message: string;
  responderId?: string;
  timestamp: Date;
  attachmentURL?: string;
}

export interface Complaint {
  _id: string;
  studentId: string;
  studentName: string; // Denormalized for easier display
  studentCampus: string; // Denormalized
  category: ComplaintCategory;
  description: string;
  priority: ComplaintPriority;
  attachmentURL?: string;
  status: ComplaintStatus;
  assignedTo?: string; // adminId
  timeline: TimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}