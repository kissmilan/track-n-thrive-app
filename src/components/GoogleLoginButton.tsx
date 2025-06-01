
import React, { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}

const GoogleLoginButton = ({ onSuccess, onError }: GoogleLoginButtonProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: '1070518728039-4l0ambas9mhvoom8ssl1lj9hl0tb5irj.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
        }
      );
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
      onError?.();
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    console.log("ID token:", response.credential);
    onSuccess(response.credential);
  };

  return <div id="googleSignInDiv" className="w-full"></div>;
};

export default GoogleLoginButton;
