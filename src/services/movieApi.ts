// Movie API Service for fetching latest Bollywood movies
export interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  duration: string;
  genre: string;
  showtimes: string[];
  description: string;
  releaseDate?: string;
  director?: string;
  cast?: string[];
  language?: string;
}

// Fallback movie data when API is not available
export const fallbackMovies: Movie[] = [
  {
    id: "1",
    title: "Saiyaara",
    poster: "https://images.moneycontrol.com/static-mcnews/2025/07/20250718081410_saiyaara.jpg?impolicy=website&width=770&height=431",
    rating: 8.5,
    duration: "2h 20min",
    genre: "Drama",
    showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
    description: "Saiyaara is a heart-touching drama that explores the journey of love, loss, and hope. Experience the emotional rollercoaster with breathtaking performances and soulful music.",
    releaseDate: "2025-01-15",
    director: "Imtiaz Ali",
    cast: ["Kartik Aaryan", "Sara Ali Khan"],
    language: "Hindi"
  },
  {
    id: "2",
    title: "Ramayana",
    poster: "https://images.ctfassets.net/3sjsytt3tkv5/4TZbGmtfPDnaK6oUTvpn55/5f293d924de5cf48d419f3460603de5d/1920X1080_DNEG_RD_With_Logo.jpg",
    rating: 9.0,
    duration: "2h 40min",
    genre: "Mythology, Drama",
    showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
    description: "A grand retelling of the epic Ramayana, starring Ranbir Kapoor and Sai Pallavi, set to be one of the biggest releases of 2025.",
    releaseDate: "2025-03-21",
    director: "Nitesh Tiwari",
    cast: ["Ranbir Kapoor", "Sai Pallavi", "Yash"],
    language: "Hindi"
  },
  {
    id: "3",
    title: "Brahmastra Part 2: Dev",
    poster: "https://preview.redd.it/ranveer-dp-confirmed-in-brahmastra-2-poster-leaked-v0-ewnp4uywjurc1.jpeg?auto=webp&s=0a9dac0bd63348d7a7c0e9f7369bda015055f4ef",
    rating: 8.5,
    duration: "2h 45min",
    genre: "Fantasy, Adventure",
    showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
    description: "The next chapter in the Astraverse, exploring the story of Dev and the mysteries of the Brahmastra.",
    releaseDate: "2025-06-20",
    director: "Ayan Mukerji",
    cast: ["Ranbir Kapoor", "Alia Bhatt", "Ranveer Singh"],
    language: "Hindi"
  },
  {
    id: "4",
    title: "War 2",
    poster: "https://www.yashrajfilms.com/images/default-source/movies/war2/war2_767x430.jpg?sfvrsn=8e46decc_1",
    rating: 8.4,
    duration: "2h 35min",
    genre: "Action, Thriller",
    showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
    description: "Hrithik Roshan returns in this high-stakes action thriller, continuing the War franchise.",
    releaseDate: "2025-08-15",
    director: "Ayan Mukerji",
    cast: ["Hrithik Roshan", "Kiara Advani", "NTR Jr"],
    language: "Hindi"
  }
];

// API Configuration
const API_CONFIG = {
  // You can use these APIs for real movie data:
  // 1. TMDB API (The Movie Database) - Free tier available
  // 2. OMDB API (Open Movie Database) - Free tier available
  // 3. Custom backend API
  
  // For now, we'll use a mock API that can be easily replaced
  baseUrl: 'https://api.themoviedb.org/3',
  apiKey: process.env.VITE_TMDB_API_KEY || '', // Add your API key to .env file
  
  // Fallback to local data if no API key
  useLocalData: !process.env.VITE_TMDB_API_KEY
};

// Fetch movies from TMDB API (Bollywood movies)
export const fetchMoviesFromAPI = async (): Promise<Movie[]> => {
  try {
    if (API_CONFIG.useLocalData) {
      console.log('Using local movie data (no API key configured)');
      return fallbackMovies;
    }

    // Fetch upcoming Bollywood movies from TMDB
    const response = await fetch(
      `${API_CONFIG.baseUrl}/discover/movie?api_key=${API_CONFIG.apiKey}&with_origin_country=IN&sort_by=popularity.desc&include_adult=false&language=en-US&page=1`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform TMDB data to our Movie interface
    const movies: Movie[] = data.results.slice(0, 8).map((movie: any, index: number) => ({
      id: movie.id.toString(),
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: Math.round((movie.vote_average / 2) * 10) / 10, // Convert 10-point scale to 5-point
      duration: `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`,
      genre: movie.genre_ids.join(', '), // You'd need to map genre IDs to names
      showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
      description: movie.overview || "Experience the magic of cinema with this latest release.",
      releaseDate: movie.release_date,
      language: "Hindi"
    }));

    return movies;
  } catch (error) {
    console.error('Error fetching movies from API:', error);
    return fallbackMovies;
  }
};

// Fetch movie details by ID
export const fetchMovieById = async (id: string): Promise<Movie | null> => {
  try {
    if (API_CONFIG.useLocalData) {
      return fallbackMovies.find(movie => movie.id === id) || null;
    }

    const response = await fetch(
      `${API_CONFIG.baseUrl}/movie/${id}?api_key=${API_CONFIG.apiKey}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const movie = await response.json();
    
    return {
      id: movie.id.toString(),
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: Math.round((movie.vote_average / 2) * 10) / 10,
      duration: `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`,
      genre: movie.genres?.map((g: any) => g.name).join(', ') || '',
      showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
      description: movie.overview || "Experience the magic of cinema with this latest release.",
      releaseDate: movie.release_date,
      director: movie.director || "Unknown",
      cast: movie.cast?.slice(0, 5).map((c: any) => c.name) || [],
      language: movie.original_language === 'hi' ? 'Hindi' : 'English'
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return fallbackMovies.find(movie => movie.id === id) || null;
  }
};

// Search movies by title
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    if (API_CONFIG.useLocalData) {
      return fallbackMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    const response = await fetch(
      `${API_CONFIG.baseUrl}/search/movie?api_key=${API_CONFIG.apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results.slice(0, 8).map((movie: any) => ({
      id: movie.id.toString(),
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: Math.round((movie.vote_average / 2) * 10) / 10,
      duration: `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`,
      genre: movie.genre_ids.join(', '),
      showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
      description: movie.overview || "Experience the magic of cinema with this latest release.",
      releaseDate: movie.release_date,
      language: "Hindi"
    }));
  } catch (error) {
    console.error('Error searching movies:', error);
    return fallbackMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Get upcoming movies (releases in next 3 months)
export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  try {
    if (API_CONFIG.useLocalData) {
      return fallbackMovies.filter(movie => 
        movie.releaseDate && new Date(movie.releaseDate) > new Date()
      );
    }

    const response = await fetch(
      `${API_CONFIG.baseUrl}/movie/upcoming?api_key=${API_CONFIG.apiKey}&language=en-US&page=1&region=IN`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results.slice(0, 6).map((movie: any) => ({
      id: movie.id.toString(),
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: Math.round((movie.vote_average / 2) * 10) / 10,
      duration: `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`,
      genre: movie.genre_ids.join(', '),
      showtimes: ["12:00PM", "3:00PM", "6:00PM", "9:00PM"],
      description: movie.overview || "Coming soon to theaters near you.",
      releaseDate: movie.release_date,
      language: "Hindi"
    }));
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return fallbackMovies.filter(movie => 
      movie.releaseDate && new Date(movie.releaseDate) > new Date()
    );
  }
};
