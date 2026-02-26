import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchBar = ({ 
  placeholder = "Search cars, brands, or features...", 
  onSearch 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder={placeholder} 
          className="pl-10 py-6 text-base rounded-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;