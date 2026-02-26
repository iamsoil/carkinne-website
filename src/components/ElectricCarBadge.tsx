import { Battery } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ElectricCarBadgeProps {
  range: number;
}

const ElectricCarBadge = ({ range }: ElectricCarBadgeProps) => {
  return (
    <Badge className="bg-green-500 text-white">
      <Battery className="h-3 w-3 mr-1" />
      {range} km
    </Badge>
  );
};

export default ElectricCarBadge;