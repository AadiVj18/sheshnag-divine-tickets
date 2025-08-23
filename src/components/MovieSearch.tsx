import { useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface MovieSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onGenreFilter: (genre: string) => void;
  onRatingFilter: (rating: number) => void;
  onSort: (sortBy: 'title' | 'rating' | 'releaseDate') => void;
  onRefresh: () => void;
  loading?: boolean;
}

const genres = [
  'All',
  'Action',
  'Drama',
  'Comedy',
  'Thriller',
  'Romance',
  'Horror',
  'Fantasy',
  'Adventure',
  'Mystery'
];

const ratings = [
  { value: 0, label: 'All Ratings' },
  { value: 7, label: '7+ Stars' },
  { value: 8, label: '8+ Stars' },
  { value: 9, label: '9+ Stars' }
];

const sortOptions = [
  { value: 'title', label: 'Title A-Z' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'releaseDate', label: 'Latest Releases' }
];

export const MovieSearch = ({
  searchQuery,
  onSearchChange,
  onGenreFilter,
  onRatingFilter,
  onSort,
  onRefresh,
  loading = false
}: MovieSearchProps) => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedSort, setSelectedSort] = useState('title');

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    onGenreFilter(genre);
  };

  const handleRatingChange = (rating: string) => {
    const ratingValue = parseInt(rating);
    setSelectedRating(ratingValue);
    onRatingFilter(ratingValue);
  };

  const handleSortChange = (sortBy: string) => {
    setSelectedSort(sortBy);
    onSort(sortBy as 'title' | 'rating' | 'releaseDate');
  };

  const clearFilters = () => {
    setSelectedGenre('All');
    setSelectedRating(0);
    setSelectedSort('title');
    onSearchChange('');
    onGenreFilter('All');
    onRatingFilter(0);
    onSort('title');
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search movies by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Genre Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedGenre} onValueChange={handleGenreChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <Select value={selectedRating.toString()} onValueChange={handleRatingChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            {ratings.map((rating) => (
              <SelectItem key={rating.value} value={rating.value.toString()}>
                {rating.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select value={selectedSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {(selectedGenre !== 'All' || selectedRating > 0 || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedGenre !== 'All' || selectedRating > 0 || searchQuery) && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
            </Badge>
          )}
          {selectedGenre !== 'All' && (
            <Badge variant="secondary">
              Genre: {selectedGenre}
            </Badge>
          )}
          {selectedRating > 0 && (
            <Badge variant="secondary">
              Rating: {selectedRating}+ Stars
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
