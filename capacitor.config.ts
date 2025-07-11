
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.fd86b76971df425aa3b4a077107181b6',
  appName: 'FitTracker Pro',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://fd86b769-71df-425a-a3b4-a077107181b6.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
