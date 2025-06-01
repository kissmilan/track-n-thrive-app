
import React, { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLoginButton = () => {
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
        }
      );
    };
    document.body.appendChild(script);
  }, []);

  const handleCredentialResponse = (response: any) => {
    console.log("ID token:", response.credential);
    // Itt küldheted el a backendednek POST-tal
  };

  return <div id="googleSignInDiv"></div>;
};

export default GoogleLoginButton;
