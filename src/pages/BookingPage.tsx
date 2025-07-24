import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/BookingForm";
import { ArrowLeft, Film } from "lucide-react";
import lordShivaIcon from "@/assets/lord-shiva-icon.png";

// Mock movie data - in a real app, this would come from an API
const mockMovies = [
  {
    id: "1",
    title: "Avatar: The Way of Water",
    poster: "https://images.unsplash.com/photo-1489599133175-7f3a5b38b0c1?w=400&h=600&fit=crop",
    rating: 7.8,
    duration: "3h 12min",
    genre: "Sci-Fi",
    showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
    description: "Set more than a decade after the events of the first film, Avatar: The Way of Water tells the story of the Sully family."
  },
  {
    id: "2",
    title: "Top Gun: Maverick",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop",
    rating: 8.7,
    duration: "2h 11min",
    genre: "Action",
    showtimes: ["11:00 AM", "2:00 PM", "6:00 PM", "9:00 PM"],
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator."
  },
  {
    id: "3",
    title: "Spider-Man: No Way Home",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop",
    rating: 8.2,
    duration: "2h 28min",
    genre: "Action",
    showtimes: ["10:30 AM", "1:45 PM", "5:15 PM", "8:45 PM"],
    description: "Spider-Man's identity is revealed to the entire world, and he can no longer separate his normal life from his superhero responsibilities."
  },
  {
    id: "4",
    title: "Dune",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    rating: 8.1,
    duration: "2h 35min",
    genre: "Sci-Fi",
    showtimes: ["9:30 AM", "1:00 PM", "4:30 PM", "8:00 PM"],
    description: "Paul Atreides leads nomadic tribes in a revolt against the galactic emperor and his father's evil nemesis."
  },
  {
    id: "5",
    title: "The Batman",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    rating: 7.9,
    duration: "2h 56min",
    genre: "Action",
    showtimes: ["10:15 AM", "2:30 PM", "6:30 PM", "9:30 PM"],
    description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues."
  },
  {
    id: "6",
    title: "Interstellar",
    poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
    rating: 8.6,
    duration: "2h 49min",
    genre: "Sci-Fi",
    showtimes: ["9:00 AM", "12:45 PM", "4:15 PM", "7:45 PM"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  }
];

export default function BookingPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const movie = mockMovies.find(m => m.id === movieId);

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-divine-white via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Film className="w-16 h-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold text-deep-blue">Movie Not Found</h1>
          <p className="text-muted-foreground">The movie you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-deep-blue to-primary hover:from-primary hover:to-deep-blue">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
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
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                  />
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
            />
          </div>
        </div>
      </main>
    </div>
  );
}