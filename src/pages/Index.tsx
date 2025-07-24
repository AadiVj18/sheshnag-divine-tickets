import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { Badge } from "@/components/ui/badge";
import { Film, Sparkles, Clock, MapPin } from "lucide-react";

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

const Index = () => {
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
            <Badge className="bg-gradient-to-r from-saffron to-accent text-white border-0 px-4 py-2">
              Premium Quality
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-deep-blue to-primary text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80 mb-2">
            © 2024 Sheshnag Cinema. All rights reserved.
          </p>
          <p className="text-white/60 text-sm italic">
            "Blessed by divine grace, powered by cinematic excellence"
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
