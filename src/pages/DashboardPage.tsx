// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Assuming this is for your Google/Primary Auth
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User as UserIcon, Slack, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Define a type for your Deshi user object (adjust as per your primary auth)
interface DeshiUser {
  id: string; 
  name?: string;
  email?: string;
  picture?: string; 
}

interface SlackConnection {
  team_id: string;
  team_name?: string; 
  is_active: boolean;
}

// Get Slack config from .env variables
const SLACK_CLIENT_ID = import.meta.env.VITE_SLACK_CLIENT_ID;
const SLACK_SCOPES = import.meta.env.VITE_SLACK_APP_SCOPES;
// This is the URI your BACKEND will receive the callback at from Slack
const SLACK_BACKEND_CALLBACK_URI = import.meta.env.VITE_SLACK_BACKEND_REDIRECT_URI; 

// Base URL for your backend (optional if SLACK_BACKEND_CALLBACK_URI is absolute)
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const DESHI_COLLECTOR_EMBED_URL = "https://deshi-collector.streamlit.app/";
const REPLICA_MANAGER_EMBED_URL = "https://replicamanager.streamlit.app/";


const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: googleUser, signOutGoogle, isLoading: authIsLoading } = useAuth(); 
  
  const [deshiUser, setDeshiUser] = useState<DeshiUser | null>(null);
  const [slackConnection, setSlackConnection] = useState<SlackConnection | null>(null);
  const [isConnectingSlack, setIsConnectingSlack] = useState(false);
  const [isLoadingPageData, setIsLoadingPageData] = useState(true);

  useEffect(() => {
    if (!authIsLoading && googleUser) {
      // Assuming googleUser.sub is the unique ID you use for Deshi user
      // In a real app, you might fetch more Deshi user details from your backend
      setDeshiUser({ 
        id: googleUser.sub || "unknown_user_id", // Use googleUser.sub or another unique identifier
        name: googleUser.name, 
        email: googleUser.email, 
        picture: googleUser.picture 
      });
    } else if (!authIsLoading && !googleUser) {
      navigate('/auth'); // Should be handled by ProtectedRoute
    }
  }, [googleUser, authIsLoading, navigate]);

  useEffect(() => {
    // This effect runs when deshiUser is set and handles Slack redirect params
    if (deshiUser) { 
      setIsLoadingPageData(true); // Start loading page-specific data
      const slackStatus = searchParams.get('slack_link_status');
      const teamId = searchParams.get('team_id');
      const teamName = searchParams.get('team_name'); // Assuming backend might send team_name
      const errorMessage = searchParams.get('error_message');

      if (slackStatus === 'success' && teamId) {
        setSlackConnection({ 
          team_id: teamId, 
          is_active: true, 
          team_name: teamName || `Workspace ${teamId.substring(0,5)}...` 
        });
        toast.success("Slack connected successfully!");
      } else if (slackStatus === 'error') {
        toast.error(`Slack Connection Error: ${errorMessage || "Unknown error"}`);
        setSlackConnection(null); // Ensure connection is reset on error
      } else {
        // TODO: Implement fetching current Slack connection status from your backend
        // e.g., GET /api/v1/users/me/slack-integration
        // This is important if the user reloads the page or navigates back.
        // For now, we assume no connection if not redirected AND no existing connection is stored.
        console.log("No Slack redirect params found. Fetching current status if applicable or assuming none.");
        // Example: fetchSlackStatus();
      }
      
      // Clean up URL params
      if (slackStatus || teamId || errorMessage || teamName) {
        searchParams.delete('slack_link_status');
        searchParams.delete('team_id');
        searchParams.delete('error_message');
        searchParams.delete('team_name');
        setSearchParams(searchParams, { replace: true });
      }
      setIsLoadingPageData(false);
    }
  }, [deshiUser, searchParams, setSearchParams]);


  const handleAddDeshiToSlack = () => {
    if (!SLACK_CLIENT_ID || !SLACK_SCOPES || !SLACK_BACKEND_CALLBACK_URI) {
      toast.error("Slack integration is not configured properly on the frontend. Please contact support.");
      console.error("Missing Slack configuration (VITE_SLACK_CLIENT_ID, VITE_SLACK_APP_SCOPES, or VITE_SLACK_BACKEND_REDIRECT_URI) in .env");
      return;
    }
    setIsConnectingSlack(true);
    
    const encodedRedirectUri = encodeURIComponent(SLACK_BACKEND_CALLBACK_URI);
    
    // Optional: Add a 'state' parameter for CSRF protection. Your backend must verify it.
    // const state = Math.random().toString(36).substring(2, 15);
    // sessionStorage.setItem('slackOauthState', state);
    // const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${SLACK_SCOPES}&redirect_uri=${encodedRedirectUri}&state=${state}&user_scope=`;

    // Pass Deshi User ID (Google User Sub) in state so backend can associate Slack token with this user
    const statePayload = JSON.stringify({ userId: deshiUser?.id, csrf: Math.random().toString(36).substring(2, 15) });
    sessionStorage.setItem('slackOauthStateCSRF', JSON.parse(statePayload).csrf); // Store CSRF part for verification on return
    
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${SLACK_SCOPES}&redirect_uri=${encodedRedirectUri}&user_scope=&state=${encodeURIComponent(statePayload)}`;
    
    window.location.href = slackAuthUrl;
  };

  const handleSignOut = () => {
    signOutGoogle(); 
    navigate('/auth'); 
  };

  if (authIsLoading || isLoadingPageData) {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-space">
            <Loader2 className="w-12 h-12 animate-spin text-sky-400" />
            <p className="mt-4 text-lg">Loading Dashboard...</p>
        </div>
    );
  }

  if (!googleUser || !deshiUser) {
    // This case should ideally be caught by ProtectedRoute, but as a fallback:
    return <div className="text-white text-center p-10 font-space min-h-screen flex items-center justify-center bg-gray-900">User not authenticated. Redirecting...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 font-space">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Deshi Dashboard</h1>
          <div className="flex items-center gap-4">
            {deshiUser.picture ? (
              <img src={deshiUser.picture} alt={deshiUser.name || 'User Avatar'} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-8 h-8 text-gray-400 bg-gray-700 p-1 rounded-full" />
            )}
            <span className="text-sm text-gray-300 hidden sm:block">
              {deshiUser.name || deshiUser.email}
            </span>
            <Button 
              onClick={handleSignOut} 
              variant="destructive"
              size="sm"
            >
              Sign Out
            </Button>
          </div>
        </header>
        
        <main className="space-y-8">
          <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-100">Welcome, {deshiUser.name || deshiUser.email || 'User'}!</CardTitle>
              <CardDescription className="text-gray-400">Manage your AI Replicas and data integrations.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-100">
                <Slack className="w-6 h-6 text-sky-400" />
                Slack Integration & Data Collection
              </CardTitle>
              <CardDescription className="text-gray-400">
                Connect Slack to collect messages, then configure data collection for your AI Replicas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {slackConnection && slackConnection.is_active ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <p>Successfully connected to Slack workspace: <strong>{slackConnection.team_name || slackConnection.team_id}</strong></p>
                  </div>
                  <p className="text-sm text-gray-300">
                    Use the interface below to configure message collection for your Deshi AI:
                  </p>
                  <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden shadow-inner">
                    <iframe
                      src={DESHI_COLLECTOR_EMBED_URL + `?user_id=${encodeURIComponent(deshiUser.id)}&team_id=${encodeURIComponent(slackConnection.team_id)}`} // Pass user_id and team_id as query params
                      title="Deshi Knowledge Collector"
                      className="w-full h-full border-0"
                      allow="clipboard-write" // Streamlit might need this
                    />
                  </div>
                  {/* 
                  Optionally, add a button to disconnect or reconfigure Slack if needed
                  <Button variant="ghost" className="text-red-400 hover:bg-red-500/10 mt-2">
                    <XCircle className="w-4 h-4 mr-2" />
                    Disconnect or Reconfigure Slack
                  </Button> 
                  */}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-300">
                    Your Deshi AI is not yet connected to a Slack workspace.
                  </p>
                  <Button 
                    onClick={handleAddDeshiToSlack}
                    disabled={isConnectingSlack}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold text-base"
                    size="lg"
                  >
                    {isConnectingSlack ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <ExternalLink className="mr-2 h-5 w-5" />
                    )}
                    Add Deshi to Slack
                  </Button>
                  <p className="text-xs text-gray-500">
                    You will be redirected to Slack to authorize the "Deshi Knowledge Collector" app.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-100">AI Replica Management</CardTitle>
              <CardDescription className="text-gray-400">
                Manage, train, and interact with your AI Replicas here. Requires Slack integration and data collection to be active.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {slackConnection && slackConnection.is_active ? (
                <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden shadow-inner">
                  <iframe
                    src={REPLICA_MANAGER_EMBED_URL + `?user_id=${encodeURIComponent(deshiUser.id)}`} // Pass user_id as query param
                    title="Deshi Replica Manager"
                    className="w-full h-full border-0"
                    allow="clipboard-write" // Streamlit might need this
                  />
                </div>
              ) : (
                <p className="text-gray-400">
                  Please connect to Slack and configure data collection first to manage AI Replicas.
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
