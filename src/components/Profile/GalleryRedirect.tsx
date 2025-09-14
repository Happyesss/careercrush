"use client";

import { useState } from 'react';
import { Button } from '@mantine/core';
import { IconArrowRight, IconPhoto } from '@tabler/icons-react';
import { useTheme } from '../../ThemeContext';
import { useRouter } from 'next/navigation';

const GalleryRedirect = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleGalleryRedirect = () => {
    router.push('/job-gallery');
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
      isDarkMode 
        ? 'bg-third border border-gray-700/30' 
        : 'bg-white border border-gray-200/60'
    }`}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
            <IconPhoto className="h-5 w-5 text-orange-600" stroke={1.5} />
          </div>
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Gallery
          </h3>
        </div>

        {/* Gallery Image Preview */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 group">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <IconPhoto size={40} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                <div className="animate-pulse space-y-1">
                  <div className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
                  <div className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4`}></div>
                </div>
              </div>
            </div>
          )}
          <img
            src="/cc.jpg"
            alt="Career Gallery Preview"
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 transition-all duration-300 group-hover:from-black/80">
            <div className="text-white space-y-1">
              <div className="flex items-center gap-2">
                <IconPhoto size={18} />
                <span className="text-sm font-medium">Explore Gallery</span>
              </div>
              <p className="text-xs text-gray-200">
                Discover career opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm leading-relaxed ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Discover amazing career opportunities and connect with top talent in our comprehensive gallery.
        </p>

        {/* Enhanced Redirect Button */}
        <Button
          fullWidth
          variant="light"
          size="md"
          rightSection={<IconArrowRight size={16} />}
          onClick={handleGalleryRedirect}
          className={`font-medium transition-all duration-200 ${
            isDarkMode 
              ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20' 
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200'
          }`}
        >
          Visit Gallery
        </Button>
      </div>
    </div>
  );
};

export default GalleryRedirect;
