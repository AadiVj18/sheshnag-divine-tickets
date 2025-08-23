# API Integration Setup Guide

This guide will help you integrate your movie booking application with real movie APIs to get the latest Bollywood movies and posters.

## Available APIs

### 1. TMDB API (The Movie Database) - Recommended
- **Free tier**: 1,000 requests per day
- **Features**: Movie data, posters, ratings, cast information
- **Sign up**: https://www.themoviedb.org/settings/api

### 2. OMDB API (Open Movie Database)
- **Free tier**: 1,000 requests per day
- **Features**: Movie details, ratings, plot summaries
- **Sign up**: http://www.omdbapi.com/apikey.aspx

### 3. Custom Backend API
- Create your own backend to manage movie data
- Full control over data and features

## Setup Instructions

### Step 1: Get API Key

1. Go to [TMDB](https://www.themoviedb.org/settings/api)
2. Create an account
3. Request an API key
4. Copy your API key

### Step 2: Configure Environment Variables

Create a `.env` file in your project root:

```env
# Movie API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Development Settings
VITE_APP_ENV=development
VITE_APP_NAME=Sheshnag Divine Tickets
```

### Step 3: Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## Features Available with API Integration

### ✅ Current Features
- **Dynamic Movie Loading**: Movies are fetched from API instead of static data
- **Search Functionality**: Search movies by title
- **Filtering**: Filter by genre, rating
- **Sorting**: Sort by title, rating, release date
- **Error Handling**: Graceful fallback to local data if API fails
- **Loading States**: User-friendly loading indicators

### 🔄 Auto-Updating Features
- **Latest Movies**: New releases automatically appear
- **Updated Posters**: High-quality movie posters
- **Real Ratings**: Actual user ratings from TMDB
- **Cast Information**: Movie cast and crew details
- **Release Dates**: Accurate release date information

## API Endpoints Used

### TMDB API Endpoints
- `GET /discover/movie` - Get popular movies
- `GET /movie/{id}` - Get movie details
- `GET /search/movie` - Search movies
- `GET /movie/upcoming` - Get upcoming releases

### Customization Options

You can modify the API configuration in `src/services/movieApi.ts`:

```typescript
const API_CONFIG = {
  baseUrl: 'https://api.themoviedb.org/3',
  apiKey: process.env.VITE_TMDB_API_KEY || '',
  useLocalData: !process.env.VITE_TMDB_API_KEY
};
```

## Fallback System

The application includes a robust fallback system:

1. **API Available**: Uses real movie data from TMDB
2. **API Unavailable**: Falls back to curated local movie data
3. **Network Error**: Shows error message with retry option
4. **No Results**: Displays "No movies found" message

## Adding New Movies

### With API (Automatic)
- New movies are automatically added when they're added to TMDB
- No manual intervention required

### Without API (Manual)
- Edit `src/services/movieApi.ts`
- Add new movies to the `fallbackMovies` array
- Include all required fields: id, title, poster, rating, etc.

## Troubleshooting

### Common Issues

1. **"No API key configured"**
   - Add your API key to `.env` file
   - Restart the development server

2. **"API request failed"**
   - Check your internet connection
   - Verify API key is correct
   - Check API rate limits

3. **"No movies found"**
   - API might be down
   - Check browser console for errors
   - Try refreshing the page

### Debug Mode

Enable debug logging by adding to `.env`:

```env
VITE_DEBUG=true
```

## Performance Optimization

- **Caching**: API responses are cached in memory
- **Debounced Search**: Search requests are debounced to reduce API calls
- **Lazy Loading**: Images are loaded as needed
- **Error Boundaries**: Graceful error handling

## Security Notes

- Never commit your API key to version control
- Use environment variables for sensitive data
- Consider rate limiting for production use
- Monitor API usage to stay within free tier limits

## Next Steps

1. **Get your API key** from TMDB
2. **Add it to your `.env` file**
3. **Restart your development server**
4. **Enjoy real-time movie data!**

Your application will now automatically fetch and display the latest Bollywood movies with real posters, ratings, and information!
