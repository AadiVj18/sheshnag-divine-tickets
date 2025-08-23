import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/BookingForm";
import { ArrowLeft, Film, Loader2, AlertCircle } from "lucide-react";
import lordShivaIcon from "@/assets/lord-shiva-icon.png";
import { useState, useEffect } from "react";

// Fallback movie data (same as in Index.tsx)
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

interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  duration: string;
  genre: string;
  showtimes: string[];
  description: string;
}

export default function BookingPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  const handleImageError = () => {
    setImageError(true);
  };

  const fetchMovie = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_TMDB_API_KEY;

      if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
        // Use fallback data
        const fallbackMovie = fallbackMovies.find(m => m.id === movieId);
        if (fallbackMovie) {
          setMovie(fallbackMovie);
        } else {
          setError('Movie not found in local data');
        }
        setLoading(false);
        return;
      }

      // Try to fetch from TMDB API
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
        );

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        // Transform TMDB data to our format
        const transformedMovie: Movie = {
          id: data.id.toString(),
          title: data.title,
          poster: data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : fallbackMovies[0].poster,
          rating: Math.round((data.vote_average / 2) * 10) / 10,
          duration: data.runtime
            ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}min`
            : "2h 30min",
          genre: data.genres && data.genres.length > 0 
            ? data.genres.map((g: any) => g.name).join(", ")
            : "Drama",
          showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
          description: data.overview || "Experience the magic of cinema with this latest release."
        };

        setMovie(transformedMovie);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Fallback to local data
        const fallbackMovie = fallbackMovies.find(m => m.id === movieId);
        if (fallbackMovie) {
          setMovie(fallbackMovie);
        } else {
          setError('Movie not found');
        }
      }

    } catch (err) {
      console.error('Error fetching movie:', err);
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-divine-white via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
          <h1 className="text-2xl font-bold text-deep-blue">Loading Movie...</h1>
          <p className="text-muted-foreground">Please wait while we fetch the movie details.</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-divine-white via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-deep-blue">Movie Not Found</h1>
          <p className="text-muted-foreground">
            {error || "The movie you're looking for doesn't exist or is not available for booking."}
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-deep-blue to-primary hover:from-primary hover:to-deep-blue">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Movies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-white via-background to-secondary/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-deep-blue to-primary text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={lordShivaIcon} 
                alt="Lord Shiva" 
                className="w-10 h-10 rounded-full bg-white/20 p-1" 
              />
              <div>
                <h1 className="text-2xl font-bold">Sheshnag Cinema</h1>
                <p className="text-white/80 text-sm">Divine Entertainment Experience</p>
              </div>
            </div>
            <Link to="/">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Movies
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Movie Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-gradient-to-br from-divine-white to-background rounded-2xl shadow-xl p-6 border-0">
                <div className="relative mb-6">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                    {!imageError ? (
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        className="w-full h-96 object-contain bg-gradient-to-br from-gray-50 to-gray-100"
                        onError={handleImageError}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center text-gray-500">
                          <Film className="w-20 h-20 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-medium">{movie.title}</p>
                          <p className="text-sm text-gray-400">Poster not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-saffron text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ⭐ {movie.rating}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-deep-blue mb-3">{movie.title}</h2>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{movie.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Genre:</span>
                    <span className="font-medium">{movie.genre}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm 
              movieTitle={movie.title}
              showtimes={movie.showtimes}
              movieId={movie.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
}