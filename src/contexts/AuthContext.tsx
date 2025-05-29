// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode"; // Install: npm install jwt-decode

interface GoogleUser {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string; // Google's unique ID for the user
  // Add other fields you expect from the ID token
}

interface AuthContextType {
  user: GoogleUser | null;
  setUser: (user: GoogleUser | null) => void;
  isLoading: boolean; // For initial auth state check
  signInWithGoogle: (credentialResponse: any) => void; // Simplified for client-side
  signOutGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true for initial load

  const setUser = (userData: GoogleUser | null) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('googleUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('googleUser');
    }
  };

  useEffect(() => {
    // Check for persisted user on initial load
    const persistedUser = localStorage.getItem('googleUser');
    if (persistedUser) {
      try {
        setUserState(JSON.parse(persistedUser));
      } catch (e) {
        localStorage.removeItem('googleUser');
      }
    }
    setIsLoading(false);
  }, []);


  const signInWithGoogle = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const decodedToken: GoogleUser = jwtDecode(credentialResponse.credential);
        console.log("Decoded Google ID Token:", decodedToken);
        setUser(decodedToken); // Set user in context and localStorage
        // Potentially send credentialResponse.credential (the ID token string) to your backend here
        // for verification and to create a session for your own app.
        // Example:
        // sendTokenToBackend(credentialResponse.credential);
      } catch (error) {
        console.error("Error decoding Google ID token:", error);
        setUser(null);
      }
    } else {
      console.error("Google Sign-In failed:", credentialResponse);
      setUser(null);
    }
  };

  const signOutGoogle = () => {
    // For client-side only, just clear the user state
    setUser(null);
    // If you are using Google's session management, you might also call:
    // google.accounts.id.disableAutoSelect(); // To prevent auto sign-in next time
    // google.accounts.id.revoke(user?.email || '', done => { ... }); // For full logout from Google session for this app
    console.log("User signed out (client-side)");
  };
  
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, signInWithGoogle, signOutGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
