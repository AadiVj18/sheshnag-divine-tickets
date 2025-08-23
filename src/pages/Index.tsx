import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Film, Sparkles, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Fallback movie data
const fallbackMovies = [
  {
    id: "1",
    title: "Saiyaara",
    poster: "https://images.moneycontrol.com/static-mcnews/2025/07/20250718081410_saiyaara.jpg?impolicy=website&width=770&height=431",
    rating: 8.5,
    duration: "2h 20min",
    genre: "Drama",
    showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
    description: "Saiyaara is a heart-touching drama that explores the journey of love, loss, and hope."
  },
  {
    id: "2",
    title: "Ramayana",
    poster: "https://images.ctfassets.net/3sjsytt3tkv5/4TZbGmtfPDnaK6oUTvpn55/5f293d924de5cf48d419f3460603de5d/1920X1080_DNEG_RD_With_Logo.jpg",
    rating: 9.0,
    duration: "2h 40min",
    genre: "Mythology, Drama",
    showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
    description: "A grand retelling of the epic Ramayana, starring Ranbir Kapoor and Sai Pallavi."
  }
];

const Index = () => {
  const [movies, setMovies] = useState(fallbackMovies);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      
      if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
        console.log('No API key configured, using fallback data');
        setMovies(fallbackMovies);
        setLoading(false);
        return;
      }

      // Fetch popular movies from TMDB
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_origin_country=IN&sort_by=popularity.desc&include_adult=false&language=en-US&page=1`
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform TMDB data to our format
      const transformedMovies = data.results.slice(0, 8).map((movie: any) => ({
        id: movie.id.toString(),
        title: movie.title,
        poster: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : fallbackMovies[0].poster, // Fallback poster if none available
        rating: Math.round((movie.vote_average / 2) * 10) / 10, // Convert 10-point scale to 5-point
        duration: movie.runtime 
          ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`
          : "2h 30min", // Default duration
        genre: movie.genre_ids ? "Bollywood" : "Drama", // Default genre
        showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
        description: movie.overview || "Experience the magic of cinema with this latest release."
      }));

      if (transformedMovies.length > 0) {
        setMovies(transformedMovies);
      } else {
        setMovies(fallbackMovies);
      }
      
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies from API. Using local data.');
      setMovies(fallbackMovies);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-white via-background to-secondary/20">
      <Header />
      
      {/* Features Section */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-deep-blue to-primary rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-deep-blue">Premium Experience</h3>
              <p className="text-muted-foreground text-sm">State-of-the-art sound and visuals</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-saffron to-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-deep-blue">Multiple Showtimes</h3>
              <p className="text-muted-foreground text-sm">Convenient timing options</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-deep-blue rounded-full flex items-center justify-center mx-auto shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-deep-blue">Prime Location</h3>
              <p className="text-muted-foreground text-sm">Easy access and parking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Film className="w-8 h-8 text-saffron" />
            <h2 className="text-3xl font-bold text-deep-blue">Now Showing</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the magic of cinema with our carefully curated selection of blockbuster movies. 
            Book your tickets now for an unforgettable journey.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Badge className="bg-gradient-to-r from-deep-blue to-primary text-white border-0 px-4 py-2">
              Latest Releases
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              {movies.length} Movies Available
            </Badge>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
              <button
                onClick={clearError}
                className="ml-2 underline hover:no-underline"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading movies from TMDB...</span>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {!loading && (
          <div className="text-center mt-8">
            <button
              onClick={fetchMovies}
              className="bg-gradient-to-r from-deep-blue to-primary text-white px-6 py-3 rounded-lg hover:from-primary hover:to-deep-blue transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Refresh Movies
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
