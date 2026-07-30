'use client';

import { useState, useEffect } from 'react';

interface DeviceInfo {
  device: string;
  browser: string;
  os: string;
}

export function parseUserAgent(userAgent: string): DeviceInfo {
  let device = 'Desktop';
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';

  // Device detection
  if (/mobile/i.test(userAgent)) device = 'Mobile';
  if (/ipad|tablet/i.test(userAgent)) device = 'Tablet';
  
  // OS detection
  if (/windows/i.test(userAgent)) os = 'Windows';
  else if (/mac os/i.test(userAgent)) os = 'macOS';
  else if (/linux/i.test(userAgent)) os = 'Linux';
  else if (/android/i.test(userAgent)) os = 'Android';
  else if (/ios|iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';

  // Browser detection
  if (/chrome|crios/i.test(userAgent) && !/edge|edg|opr|opera/i.test(userAgent)) browser = 'Chrome';
  else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) browser = 'Safari';
  else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
  else if (/edge|edg/i.test(userAgent)) browser = 'Edge';
  else if (/opr|opera/i.test(userAgent)) browser = 'Opera';

  return { device, browser, os };
}

export function useDeviceDetect() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    device: 'Desktop',
    browser: 'Unknown Browser',
    os: 'Unknown OS',
  });

  useEffect(() => {
    setDeviceInfo(parseUserAgent(window.navigator.userAgent));
  }, []);

  return deviceInfo;
}
