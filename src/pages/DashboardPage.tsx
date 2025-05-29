// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Assuming this is for your Google/Primary Auth
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User as UserIcon, Slack, CheckCircle2, ExternalLink, Loader2, Settings, Bot } from 'lucide-react';
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

const DESHI_COLLECTOR_URL = "https://deshi-collector.streamlit.app/";
const REPLICA_MANAGER_URL = "https://replicamanager.streamlit.app/";


const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: googleUser, signOutGoogle, isLoading: authIsLoading } = useAuth(); 
  
  const [deshiUser, setDeshiUser] = useState<DeshiUser | null>(null);
  const [slackConnection, setSlackConnection] = useState<SlackConnection | null>(null);
  const [isConnectingSlack, setIsConnectingSlack] = useState(false);
  const [isLoadingPageData, setIsLoadingPageData] = useState(true);
  const [iframeCollectorLoading, setIframeCollectorLoading] = useState(true);
  const [iframeManagerLoading, setIframeManagerLoading] = useState(true);

  useEffect(() => {
    if (!authIsLoading && googleUser) {
      setDeshiUser({ 
        id: googleUser.sub || "unknown_user_id",
        name: googleUser.name, 
        email: googleUser.email, 
        picture: googleUser.picture 
      });
    } else if (!authIsLoading && !googleUser) {
      navigate('/auth'); 
    }
  }, [googleUser, authIsLoading, navigate]);

  useEffect(() => {
    if (deshiUser) { 
      setIsLoadingPageData(true);
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
      } else {
        // TODO: Implement fetching current Slack connection status from your backend
        // For now, check localStorage or a similar mechanism if you persist this info client-side after successful connection,
        // or make a fetch call to your backend to get the current status.
        // Example:
        // const checkSlackStatus = async () => {
        //   try {
        //     const response = await fetch('/api/v1/slack/status'); // your backend endpoint
        //     if (response.ok) {
        //       const data = await response.json();
        //       if (data.connected && data.team_id) {
        //         setSlackConnection({ team_id: data.team_id, team_name: data.team_name, is_active: true });
        //       } else {
        //         setSlackConnection(null);
        //       }
        //     }
        //   } catch (error) {
        //     console.error("Failed to fetch slack status", error);
        //     setSlackConnection(null);
        //   } finally {
        //      setIsLoadingPageData(false);
        //   }
        // };
        // checkSlackStatus();
        // For this example, we'll assume it needs to be fetched or it's not connected.
        // To simulate a previously connected state for testing UI, you can temporarily set it:
        // setSlackConnection({ team_id: "T12345", team_name: "Test Workspace", is_active: true }); 
        console.log("No Slack redirect params found, or need to fetch current status.");
      }
      
      if (slackStatus || teamId || errorMessage || teamName) {
        searchParams.delete('slack_link_status');
        searchParams.delete('team_id');
        searchParams.delete('team_name');
        searchParams.delete('error_message');
        setSearchParams(searchParams, { replace: true });
      }
      setIsLoadingPageData(false); // Moved here to ensure it's set after processing params or fetching status
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
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${SLACK_SCOPES}&redirect_uri=${encodedRedirectUri}&user_scope=`;
    
    window.location.href = slackAuthUrl;
  };

  const handleSignOut = () => {
    signOutGoogle(); 
    navigate('/auth'); 
  };

  if (authIsLoading || (isLoadingPageData && !deshiUser)) { // Ensure deshiUser is loaded before showing dashboard content
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
                Connect your Slack workspace and configure data collection for your Deshi AI Replicas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {slackConnection && slackConnection.is_active ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <p>Successfully connected to Slack workspace: <strong>{slackConnection.team_name || slackConnection.team_id}</strong></p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Use the interface below to manage and monitor data collection from your connected Slack workspace.
                  </p>
                  <div className="aspect-video relative">
                    {iframeCollectorLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/70 rounded-md">
                        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                        <p className="mt-2 text-gray-300">Loading Data Collector...</p>
                      </div>
                    )}
                    <iframe
                      src={DESHI_COLLECTOR_URL}
                      title="Deshi Data Collector"
                      className={`w-full h-full border-0 rounded-md ${iframeCollectorLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                      onLoad={() => setIframeCollectorLoading(false)}
                      onError={() => {
                        setIframeCollectorLoading(false);
                        toast.error("Failed to load Data Collector application.");
                      }}
                      allowFullScreen
                    ></iframe>
                  </div>
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
              <CardTitle className="flex items-center gap-2 text-xl text-gray-100">
                <Bot className="w-6 h-6 text-purple-400" />
                AI Replica Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage, train, and interact with your AI Replicas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(!slackConnection || !slackConnection.is_active) && (
                 <p className="text-gray-400 text-sm mb-4">
                    Please connect to Slack first to enable AI Replica management.
                  </p>
              )}
              <div className="aspect-video relative">
                {iframeManagerLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/70 rounded-md">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                    <p className="mt-2 text-gray-300">Loading Replica Manager...</p>
                  </div>
                )}
                <iframe
                  src={REPLICA_MANAGER_URL}
                  title="AI Replica Manager"
                  className={`w-full h-full border-0 rounded-md ${iframeManagerLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                  onLoad={() => setIframeManagerLoading(false)}
                  onError={() => {
                    setIframeManagerLoading(false);
                    toast.error("Failed to load Replica Manager application.");
                  }}
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
