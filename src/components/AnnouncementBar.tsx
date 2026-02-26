import { X } from 'lucide-react';
import { useState } from 'react';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;

  return (
    <div className="bg-orange-500 text-white py-2 px-4 text-center text-sm font-medium relative">
      <div className="flex items-center justify-center">
        <span>🎉 Dashain Special: Up to Rs.2L off on selected cars</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;