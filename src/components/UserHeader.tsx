
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

interface UserHeaderProps {
  user: any;
  onDownloadApp: () => void;
  onSignOut: () => void;
}

const UserHeader = ({ user, onDownloadApp, onSignOut }: UserHeaderProps) => {
  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
      {user && (
        <div className="text-white text-sm">
          Üdv, {user.user?.name || user.name || 'Felhasználó'}!
        </div>
      )}
      <Button
        onClick={onDownloadApp}
        variant="outline"
        size="sm"
        className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
      >
        <Smartphone className="w-4 h-4 mr-1" />
        Letöltés
      </Button>
      <Button 
        onClick={onSignOut}
        variant="outline"
        className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
      >
        Kijelentkezés
      </Button>
    </div>
  );
};

export default UserHeader;
