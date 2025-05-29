// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Use your AuthContext
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center font-space">
        <Loader2 className="w-16 h-16 animate-spin text-blue-400 mb-4" />
        <p className="text-xl">Verifying Access...</p>
      </div>
    );
  }

  if (!user) { 
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
