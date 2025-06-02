
import React, { useEffect } from 'react';

interface GoogleLoginButtonProps {
  onSuccess?: (credential: string) => void;
  onError?: () => void;
}

const GoogleLoginButton = ({ onSuccess, onError }: GoogleLoginButtonProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: '1070518728039-4l0ambas9mhvoom8ssl1lj9hl0tb5irj.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          {
            theme: 'outline',
            size: 'large',
            width: 250
          }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    console.log("Google ID token:", response.credential);
    if (onSuccess) {
      onSuccess(response.credential);
    }
  };

  return <div id="googleSignInDiv" className="w-full flex justify-center"></div>;
};

export default GoogleLoginButton;
