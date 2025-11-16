import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
    onLogin: (email: string, password: string) => void;
    onSignup: (userData: Omit<User, '_id' | 'role' | 'createdAt'>) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignup }) => {
    const [isSigningUp, setIsSigningUp] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [campus, setCampus] = useState('Kochi');
    const [batch, setBatch] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isSigningUp) {
                if (!name || !email || !password || !campus || !batch) {
                    setError('All fields are required for signup.');
                    return;
                }
                onSignup({ name, email, password, campus, batch });
            } else {
                onLogin(email, password);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        }
    };

    const handleQuickLogin = (userEmail: string) => {
        setIsSigningUp(false);
        setEmail(userEmail);
        setPassword('password');
    }
    
    const toggleForm = () => {
        setError('');
        setEmail('');
        setPassword('');
        setIsSigningUp(!isSigningUp);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <div className="flex items-center justify-center space-x-3">
                        <svg className="h-10 w-10 text-blue-600 dark:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                            Broto<span className="text-blue-600 dark:text-blue-500">Care</span>
                        </h1>
                    </div>
                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {isSigningUp ? 'Create your student account' : 'Sign in to your account'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {isSigningUp && (
                             <>
                                <div>
                                    <label htmlFor="name" className="sr-only">Full Name</label>
                                    <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Full Name" />
                                </div>
                             </>
                        )}
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={`relative block w-full appearance-none rounded-none ${isSigningUp ? '' : 'rounded-t-md'} border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`} placeholder="Email address" />
                        </div>
                        {isSigningUp && (
                             <>
                                <div>
                                    <label htmlFor="batch" className="sr-only">Batch Code</label>
                                    <input id="batch" name="batch" type="text" required value={batch} onChange={(e) => setBatch(e.target.value)} className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Batch Code (e.g., MEARN-1)" />
                                </div>
                                <div>
                                    <label htmlFor="campus" className="sr-only">Campus</label>
                                    <select id="campus" name="campus" required value={campus} onChange={(e) => setCampus(e.target.value)} className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                                        <option>Kochi</option>
                                        <option>Trivandrum</option>
                                    </select>
                                </div>
                             </>
                        )}
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Password" />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                           {isSigningUp ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {isSigningUp ? (
                        <p>Already have an account? <button onClick={toggleForm} className="font-medium text-blue-600 hover:text-blue-500">Sign In</button></p>
                    ) : (
                        <p>Don't have an account? <button onClick={toggleForm} className="font-medium text-blue-600 hover:text-blue-500">Sign Up</button></p>
                    )}
                </div>

                 <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">Quick Logins (password is 'password')</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                        <button onClick={() => handleQuickLogin('arjun.s@brototype.com')} className="text-blue-600 hover:underline">Student</button>
                        <button onClick={() => handleQuickLogin('admin@brototype.com')} className="text-blue-600 hover:underline">Admin</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;