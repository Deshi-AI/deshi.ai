// src/pages/DashboardPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Use your AuthContext
import { Button } from '@/components/ui/button';
import { User as UserIcon } from 'lucide-react'; // Renamed to avoid conflict

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOutGoogle, isLoading } = useAuth();

  const handleSignOut = () => {
    signOutGoogle();
    navigate('/auth'); 
  };

  if (isLoading) {
    return <p className="text-white text-center p-10 font-space">Loading dashboard...</p>;
  }

  if (!user) {
    // This case should ideally be handled by ProtectedRoute
    // navigate('/auth'); // Already handled by ProtectedRoute, could cause loop if not careful
    return <p className="text-white text-center p-10 font-space">Redirecting to login...</p>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 font-space">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Deshi Dashboard</h1>
          <div className="flex items-center gap-4">
            {user.picture ? (
              <img src={user.picture} alt={user.name || 'User Avatar'} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-8 h-8 text-gray-400 bg-gray-700 p-1 rounded-full" />
            )}
            <span className="text-sm text-gray-300 hidden sm:block">
              {user.name || user.email}
            </span>
            <Button 
              onClick={handleSignOut} 
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Sign Out
            </Button>
          </div>
        </header>
        
        <main>
          <p className="text-xl mb-6">Welcome, <span className="font-semibold">{user.name || user.email || 'User'}</span>!</p>
          {/* <p className="text-gray-400 text-sm">Your Google User ID (sub): {user.sub}</p> */}
          
          <div className="mt-8 p-6 bg-gray-800/50 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">AI Replica Management</h2>
            <p className="text-gray-300">
              This is where you will configure your AI replica, connect data sources, initiate training, and interact with your digital twin.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Replica Status</h3>
                <p className="text-sm text-gray-400">Not Configured</p>
              </div>
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Data Sources</h3>
                <p className="text-sm text-gray-400">No sources connected</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
