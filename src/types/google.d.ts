
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          prompt: () => void;
        };
      };
    };
    gapi: {
      load: (api: string, callback: () => void) => void;
      auth2: {
        init: (config: any) => Promise<any>;
        getAuthInstance: () => any;
      };
    };
  }
}

export {};
