
import ClientDashboard from "@/components/ClientDashboard";
import AdminPanel from "@/components/AdminPanel";
import WelcomeScreen from "@/components/WelcomeScreen";
import AuthButtons from "@/components/AuthButtons";
import UserHeader from "@/components/UserHeader";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const {
    userType,
    isAuthenticated,
    isLoading,
    user,
    handleGoogleAuth,
    handleSignOut,
    handleDownloadApp
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <WelcomeScreen onDownloadApp={handleDownloadApp}>
        <AuthButtons onGoogleAuth={handleGoogleAuth} isLoading={isLoading} />
      </WelcomeScreen>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <UserHeader 
        user={user}
        onDownloadApp={handleDownloadApp}
        onSignOut={handleSignOut}
      />
      {userType === "client" ? <ClientDashboard /> : <AdminPanel />}
    </div>
  );
};

export default Index;
