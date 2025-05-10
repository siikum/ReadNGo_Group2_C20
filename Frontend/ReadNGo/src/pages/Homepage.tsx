// src/pages/Homepage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import Navbar from '../components/NavBar';
import BookCard from '../components/BookCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import { Book } from '../types/books';
import { Filters } from '../types/filter';
import { getBooks, booksFilter, booksSearchByTitle } from '../api/apiConfig';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 12;

type SortOption = 'title' | 'price' | 'publicationDate';

const Homepage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [filters, setFilters] = useState<Filters>({});
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
    checkLoginStatus();
  }, []);

  // Fetch books with filters
  const fetchBooks = async () => {
    try {
      setLoading(true);
      let response;

      // If there are active filters, use the filter endpoint
      if (Object.keys(filters).some(key => filters[key as keyof Filters])) {
        const queryParams = buildQueryParams(filters);
        response = await booksFilter(queryParams);
      } else {
        response = await getBooks();
      }

      if (response.success && response.data) {
        setBooks(response.data);
      } else {
        setError(response.error || 'Failed to fetch books');
      }
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  // Build query parameters for filter API
  const buildQueryParams = (filters: Filters): string => {
    const params = new URLSearchParams();
    
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.author) params.append('author', filters.author);
    if (filters.format) params.append('format', filters.format);
    if (filters.language) params.append('language', filters.language);
    if (filters.priceMin) params.append('minPrice', filters.priceMin.toString());
    if (filters.priceMax) params.append('maxPrice', filters.priceMax.toString());
    if (filters.rating) params.append('minRating', filters.rating.toString());
    
    return params.toString();
  };

  // Check if user is logged in
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBooks();
      return;
    }

    try {
      setLoading(true);
      const response = await booksSearchByTitle(searchQuery);
      
      if (response.success && response.data) {
        setBooks(response.data);
        setCurrentPage(1);
      } else {
        setError(response.error || 'Failed to search books');
      }
    } catch (err) {
      setError('Failed to search books');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Apply filters
  useEffect(() => {
    fetchBooks();
  }, [filters]);

  // Filter books based on availability
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Apply availability filter
    if (filters.availability === 'in-stock') {
      result = result.filter(book => book.stockQuantity > 0);
    } else if (filters.availability === 'out-of-stock') {
      result = result.filter(book => book.stockQuantity === 0);
    }

    // Apply sorting
    switch (sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'price':
        result.sort((a, b) => (a.actualPrice || a.price) - (b.actualPrice || b.price));
        break;
      case 'publicationDate':
        result.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
        break;
    }

    return result;
  }, [books, filters.availability, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle add to cart
  const handleAddToCart = (book: Book) => {
    // Here you would typically add the book to a cart context or state
    setCartCount(prev => prev + 1);
    toast.success(`${book.title} added to cart`);
  };

  // Handle login/logout
  const handleLogin = () => {
    // Navigate to login page
    window.location.href = '/login';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCartCount(0);
    toast.success('Logged out successfully');
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLogin}
        onLogoutClick={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search books by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch}>Search</Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {filteredBooks.length} books found
                </div>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="publicationDate">Publication Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Loading books...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <Button onClick={fetchBooks} className="mt-4">
                  Try Again
                </Button>
              </div>
            )}

            {/* Books Grid */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onAddToCart={() => handleAddToCart(book)}
                      onViewDetails={() => {
                        // Navigate to book details page
                        window.location.href = `/books/${book.id}`;
                      }}
                    />
                  ))}
                </div>

                {/* Empty State */}
                {paginatedBooks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No books found</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    totalItems={filteredBooks.length}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;