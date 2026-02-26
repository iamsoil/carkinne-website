import { useState } from 'react';

interface CarFeaturesListProps {
  features: string[];
  maxVisible?: number;
}

const CarFeaturesList = ({ features, maxVisible = 5 }: CarFeaturesListProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const visibleFeatures = showAll ? features : features.slice(0, maxVisible);
  const hasMore = features.length > maxVisible && !showAll;

  return (
    <div>
      <ul className="space-y-1">
        {visibleFeatures.map((feature, i) => (
          <li key={i} className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button 
          onClick={() => setShowAll(true)}
          className="text-sm text-orange-500 hover:underline mt-2"
        >
          +{features.length - maxVisible} more features
        </button>
      )}
      {showAll && features.length > maxVisible && (
        <button 
          onClick={() => setShowAll(false)}
          className="text-sm text-orange-500 hover:underline mt-2"
        >
          Show less
        </button>
      )}
    </div>
  );
};

export default CarFeaturesList;