import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

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

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-divine-white to-background">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-saffron text-white border-0 shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              {movie.rating}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 text-deep-blue group-hover:text-saffron transition-colors">
          {movie.title}
        </CardTitle>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {movie.duration}
          </div>
          <Badge variant="secondary" className="text-xs">
            {movie.genre}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {movie.description}
        </p>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Show Times:</p>
          <div className="flex flex-wrap gap-2">
            {movie.showtimes.map((time, index) => (
              <Badge key={index} variant="outline" className="text-xs border-primary/20">
                {time}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/book/${movie.id}`} className="w-full">
          <Button 
            className="w-full bg-gradient-to-r from-deep-blue to-primary hover:from-primary hover:to-deep-blue transition-all duration-300 shadow-lg hover:shadow-xl border-0"
            size="lg"
          >
            Book Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};