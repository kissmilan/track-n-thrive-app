
import { Button } from "@/components/ui/button";
import { Download, LogOut, User } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

interface UserHeaderProps {
  user: any;
  onDownloadApp: () => void;
  onSignOut: () => void;
}

const UserHeader = ({ user, onSignOut }: UserHeaderProps) => {
  const { canInstall, isInstalling, showInstallPrompt, isMobile } = usePWAInstall();

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-white font-medium">
              {user?.user?.name || 'Felhasználó'}
            </h2>
            <p className="text-gray-400 text-sm">
              {user?.user?.email}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={showInstallPrompt}
              disabled={isInstalling}
              className="flex items-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <Download className="w-4 h-4" />
              {isInstalling ? 'Telepítés...' : 'Telepítés'}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
            className="flex items-center gap-2 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Kijelentkezés
          </Button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
