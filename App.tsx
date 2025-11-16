import React, { useState, useMemo } from 'react';
import { User, Complaint } from './types';
import { MOCK_USERS, MOCK_COMPLAINTS } from './constants';
import Header from './components/Header';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);

  const handleLogin = (email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      setCurrentUser(user);
    } else {
      throw new Error('Invalid email or password.');
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSignup = (userData: Omit<User, '_id' | 'role' | 'createdAt'>) => {
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }
    
    const newUser: User = {
      _id: `student-${Date.now()}`,
      role: 'student',
      createdAt: new Date(),
      ...userData
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser); // Automatically log in after signup
  };

  const handleUpdateComplaint = (updatedComplaint: Complaint) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(c => c._id === updatedComplaint._id ? updatedComplaint : c)
    );
  };

  const handleAddComplaint = (newComplaint: Complaint) => {
    setComplaints(prevComplaints => [newComplaint, ...prevComplaints]);
  };

  const userComplaints = useMemo(() => {
    if (currentUser?.role === 'student') {
      return complaints.filter(c => c.studentId === currentUser._id);
    }
    return [];
  }, [complaints, currentUser]);

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'student':
        return <StudentDashboard user={currentUser} complaints={userComplaints} onAddComplaint={handleAddComplaint} />;
      case 'admin':
        return <AdminDashboard 
                  allComplaints={complaints} 
                  allUsers={users} 
                  onUpdateComplaint={handleUpdateComplaint}
                  currentUser={currentUser}
                />;
      default:
        return <div className="p-8 text-center text-red-500">Invalid user role.</div>;
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default App;