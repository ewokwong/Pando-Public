// Utility function to detect if user is in an in-app browser
export const isInAppBrowser = (): boolean => {
    const userAgent = navigator.userAgent || navigator.vendor;
    return /FBAN|FBAV|Instagram/.test(userAgent);
  };