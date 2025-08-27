"use client";

import { useState, useEffect } from "react";
import { IconBrandLinkedin, IconWorld } from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";

interface SocialLinkProps {
  url: string;
  type: 'linkedin' | 'portfolio';
  className?: string;
}

const SocialLink = ({ url, type, className = "" }: SocialLinkProps) => {
  const { isDarkMode } = useTheme();
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [faviconError, setFaviconError] = useState(false);

  useEffect(() => {
    if (type === 'portfolio' && url) {
      fetchFavicon(url);
    }
  }, [url, type]);

  const fetchFavicon = async (websiteUrl: string) => {
    try {
      // Extract domain from URL
      const urlObj = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
      const domain = urlObj.hostname;
      
      // Try Google's favicon service first (most reliable)
      const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
      
      // Create a promise to test if the favicon loads
      const testFavicon = new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(googleFaviconUrl);
        img.onerror = () => reject();
        img.src = googleFaviconUrl;
      });

      // Set a timeout for favicon loading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Favicon loading timeout')), 3000);
      });

      try {
        const faviconUrl = await Promise.race([testFavicon, timeoutPromise]);
        setFaviconUrl(faviconUrl);
        setFaviconError(false);
      } catch {
        setFaviconError(true);
      }
      
    } catch (error) {
      console.error('Error fetching favicon:', error);
      setFaviconError(true);
    }
  };

  const handleClick = () => {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getIcon = () => {
    if (type === 'linkedin') {
      return <IconBrandLinkedin size={20} className="text-blue-600" />;
    }
    
    if (type === 'portfolio') {
      if (faviconUrl && !faviconError) {
        return (
          <img 
            src={faviconUrl} 
            alt="Website favicon" 
            className="w-5 h-5 rounded-sm object-contain"
            onError={() => setFaviconError(true)}
          />
        );
      }
      return <IconWorld size={20} className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} />;
    }
  };

  const getLabel = () => {
    if (type === 'linkedin') return 'LinkedIn';
    if (type === 'portfolio') {
      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        return urlObj.hostname.replace('www.', '');
      } catch {
        return 'Portfolio';
      }
    }
  };

  if (!url) return null;

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:scale-105 transform duration-200 ${
        isDarkMode 
          ? 'bg-cape-cod-800 hover:bg-cape-cod-700 text-cape-cod-100' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
      } ${className}`}
      title={`Visit ${getLabel()}`}
    >
      {getIcon()}
      <span className="text-sm font-medium">{getLabel()}</span>
    </button>
  );
};

export default SocialLink;