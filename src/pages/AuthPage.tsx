// src/pages/AuthPage.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '@/contexts/AuthContext'; // Use your AuthContext
import { Loader2 } from 'lucide-react';

// Declare google variable from the GSI script
declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signInWithGoogle, isLoading: authIsLoading } = useAuth();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const googleButtonDiv = useRef<HTMLDivElement>(null);

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (!authIsLoading && user) {
      navigate(from, { replace: true });
    }
  }, [user, authIsLoading, navigate, from]);

  useEffect(() => {
    if (authIsLoading || user) return; // Don't initialize if loading or already logged in

    if (!GOOGLE_CLIENT_ID) {
      console.error("Google Client ID is not configured!");
      return;
    }

    if (window.google && googleButtonDiv.current) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: signInWithGoogle, // Your callback function from AuthContext
        // auto_select: true, // Enables one-tap sign-in if user has a session
        // login_uri: `http://localhost:8080/auth` // Or your auth page URL
      });
      window.google.accounts.id.renderButton(
        googleButtonDiv.current,
        { theme: "outline", size: "large", type: "standard", text: "signin_with" } 
      );
      // Optional: Display one-tap prompt
      // window.google.accounts.id.prompt(); 
    } else {
      // Retry or log error if google object isn't ready yet
      // This can happen due to async script loading. A timeout/retry might be needed in robust apps.
      console.warn("Google Identity Services GSI client not ready yet or button div not found.");
    }
  }, [authIsLoading, user, signInWithGoogle]);


  useEffect(() => {
    if (!backgroundRef.current) return;
    const ctx = gsap.context(() => {
      // ... (your existing background GSAP animations)
      const particles = gsap.utils.toArray(".auth-particle");
      particles.forEach((particle) => {
        gsap.to(particle as HTMLElement, {
          y: "random(-50, 50)", x: "random(-50, 50)", scale: "random(0.5, 1.2)",
          opacity: "random(0.3, 0.8)", duration: "random(10, 20)", repeat: -1,
          yoyo: true, ease: "sine.inOut",
        });
      });
      gsap.to(".auth-pulse-particle", {
        scale: "random(1.2, 2.5)", opacity: "random(0.2, 0.6)",
        duration: "random(3, 7)", repeat: -1, yoyo: true,
        ease: "power1.inOut", stagger: 0.8
      });
    }, backgroundRef);
    return () => ctx.revert();
  }, []);

  if (authIsLoading) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center font-space">
        <Loader2 className="w-16 h-16 animate-spin text-blue-400 mb-4" />
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div ref={backgroundRef} className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-space">
      <div className="fixed inset-0 pointer-events-none opacity-70 z-0">
        {/* ... (your existing background particle elements) ... */}
        {[...Array(20)].map((_, i) => ( <div key={`auth-particle-${i}`} className="auth-particle absolute w-2 h-2 bg-gradient-to-r from-green-500 to-lime-500 rounded-full shadow-lg" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} /> ))}
        {[...Array(10)].map((_, i) => ( <div key={`auth-pulse-${i}`} className="auth-pulse-particle absolute w-3 h-3 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full shadow-md" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} /> ))}
        <div className="absolute inset-0 bg-gradient-to-tr from-lime-900/10 via-transparent to-green-900/10 animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <a href="/" className="mb-8">
           <h1 className="text-5xl font-bold tracking-wider text-white">Deshi.ai</h1>
        </a>
        <p className="text-gray-300 text-xl mb-10">Access Your Eternal Memory</p>
        
        <div className="w-full max-w-xs bg-black/40 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700/50 flex flex-col items-center">
          {/* Container for the Google Sign-In button */}
          <div ref={googleButtonDiv} id="google-signin-button"></div>
          {!GOOGLE_CLIENT_ID && <p className="text-red-500 text-xs mt-2">Google Client ID not configured.</p>}
        </div>
        <p className="mt-10 text-xs text-gray-500 z-10">
          By signing in, you agree to our <a href="/terms" className="underline hover:text-gray-300">Terms of Service</a> and <a href="/privacy" className="underline hover:text-gray-300">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
