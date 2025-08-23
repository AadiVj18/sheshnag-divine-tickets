import { useState, useEffect, useCallback } from 'react';
import { Movie, fetchMoviesFromAPI, searchMovies, fetchUpcomingMovies } from '@/services/movieApi';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  // Fetch all movies
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const movieData = await fetchMoviesFromAPI();
      setMovies(movieData);
      setFilteredMovies(movieData);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search movies
  const searchMoviesByQuery = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredMovies(movies);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchMovies(query);
      setFilteredMovies(searchResults);
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error('Error searching movies:', err);
    } finally {
      setLoading(false);
    }
  }, [movies]);

  // Fetch upcoming movies
  const fetchUpcoming = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const upcomingData = await fetchUpcomingMovies();
      setMovies(upcomingData);
      setFilteredMovies(upcomingData);
    } catch (err) {
      setError('Failed to fetch upcoming movies. Please try again later.');
      console.error('Error fetching upcoming movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter movies by genre
  const filterByGenre = useCallback((genre: string) => {
    if (!genre || genre === 'All') {
      setFilteredMovies(movies);
      return;
    }
    
    const filtered = movies.filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [movies]);

  // Filter movies by rating
  const filterByRating = useCallback((minRating: number) => {
    const filtered = movies.filter(movie => movie.rating >= minRating);
    setFilteredMovies(filtered);
  }, [movies]);

  // Sort movies
  const sortMovies = useCallback((sortBy: 'title' | 'rating' | 'releaseDate') => {
    const sorted = [...filteredMovies].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'releaseDate':
          if (!a.releaseDate || !b.releaseDate) return 0;
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        default:
          return 0;
      }
    });
    setFilteredMovies(sorted);
  }, [filteredMovies]);

  // Refresh movies (useful for getting latest data)
  const refreshMovies = useCallback(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Handle search query changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        searchMoviesByQuery(searchQuery);
      } else {
        setFilteredMovies(movies);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchMoviesByQuery, movies]);

  // Initial load
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies: filteredMovies,
    allMovies: movies,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchMovies,
    searchMoviesByQuery,
    fetchUpcoming,
    filterByGenre,
    filterByRating,
    sortMovies,
    refreshMovies,
    clearError: () => setError(null)
  };
};
