import React from 'react';

interface AdBannerProps {
  position: 'header' | 'sidebar' | 'footer' | 'inline';
  size?: 'small' | 'medium' | 'large';
}

const AdBanner: React.FC<AdBannerProps> = ({ position, size = 'medium' }) => {
  const getAdDimensions = () => {
    switch (position) {
      case 'header':
        return 'h-20 max-w-7xl mx-auto';
      case 'sidebar':
        return 'h-64 w-full';
      case 'footer':
        return 'h-24 max-w-7xl mx-auto';
      case 'inline':
        return size === 'small' ? 'h-32' : size === 'large' ? 'h-64' : 'h-48';
      default:
        return 'h-48';
    }
  };

  return (
    <div className={`bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${getAdDimensions()} flex items-center justify-center m-4 rounded-lg`}>
      <div className="text-center text-gray-500 dark:text-gray-400">
        <div className="text-sm font-medium mb-1">Espacio Publicitario</div>
        <div className="text-xs">Google AdSense - {position}</div>
      </div>
    </div>
  );
};

export default AdBanner;