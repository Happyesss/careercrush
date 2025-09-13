"use client";

import { useState } from 'react';
import { Card, Text, Button } from '@mantine/core';
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
    <Card shadow="sm" p="md" radius="md" className={`bg-white dark:bg-[var(--color-third)]`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <IconPhoto size={20} className="text-gray-600 dark:text-gray-300" />
          <Text fw={500} size="lg" className="text-gray-900 dark:text-white">
            Gallery
          </Text>
        </div>

        {/* Gallery Image Preview */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <IconPhoto size={48} className="text-gray-400" />
            </div>
          )}
          <img
            src="/cc.jpg" // Using the existing cc.jpg from public folder
            alt="Career Gallery Preview"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)} // Show placeholder on error
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <IconPhoto size={32} className="mx-auto mb-2" />
              <Text size="sm" fw={500}>Explore Gallery</Text>
            </div>
          </div>
        </div>

        {/* Description */}
  <Text size="sm" className="text-gray-600 dark:text-gray-300">
          Discover amazing career opportunities and connect with top talent in our gallery.
        </Text>

        {/* Redirect Button */}
        <Button
          fullWidth
          variant="light"
          color="blue"
          rightSection={<IconArrowRight size={16} />}
          onClick={handleGalleryRedirect}
          className="mt-3"
        >
          Visit Gallery
        </Button>
      </div>
    </Card>
  );
};

export default GalleryRedirect;
