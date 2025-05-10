// src/components/FilterSidebar.tsx
import React from 'react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Filters } from '../types/filter';

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onReset: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Filters
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Genre Filter */}
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Select
            value={filters.genre || ''}
            onValueChange={(value) => handleFilterChange('genre', value || undefined)}
          >
            <SelectTrigger id="genre">
              <SelectValue placeholder="Select Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Genres</SelectItem>
              <SelectItem value="Fiction">Fiction</SelectItem>
              <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
              <SelectItem value="Mystery">Mystery</SelectItem>
              <SelectItem value="Romance">Romance</SelectItem>
              <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
              <SelectItem value="Fantasy">Fantasy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Author Filter */}
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Select
            value={filters.author || ''}
            onValueChange={(value) => handleFilterChange('author', value || undefined)}
          >
            <SelectTrigger id="author">
              <SelectValue placeholder="Select Author" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Authors</SelectItem>
              {/* These would be populated dynamically */}
              <SelectItem value="Author 1">Author 1</SelectItem>
              <SelectItem value="Author 2">Author 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Format Filter */}
        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <Select
            value={filters.format || ''}
            onValueChange={(value) => handleFilterChange('format', value || undefined)}
          >
            <SelectTrigger id="format">
              <SelectValue placeholder="Select Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Formats</SelectItem>
              <SelectItem value="Hardcover">Hardcover</SelectItem>
              <SelectItem value="Paperback">Paperback</SelectItem>
              <SelectItem value="eBook">eBook</SelectItem>
              <SelectItem value="Audiobook">Audiobook</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Availability Filter */}
        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select
            value={filters.availability || ''}
            onValueChange={(value) => handleFilterChange('availability', value || undefined)}
          >
            <SelectTrigger id="availability">
              <SelectValue placeholder="Select Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Books</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceMin || ''}
              onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceMax || ''}
              onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label htmlFor="rating">Minimum Rating</Label>
          <Select
            value={filters.rating?.toString() || ''}
            onValueChange={(value) => handleFilterChange('rating', value ? Number(value) : undefined)}
          >
            <SelectTrigger id="rating">
              <SelectValue placeholder="Select Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Rating</SelectItem>
              <SelectItem value="1">1+ Stars</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language Filter */}
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={filters.language || ''}
            onValueChange={(value) => handleFilterChange('language', value || undefined)}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Languages</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;