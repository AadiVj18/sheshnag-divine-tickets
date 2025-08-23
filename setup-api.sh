#!/bin/bash

echo "🎬 Setting up Movie API Integration for Sheshnag Divine Tickets"
echo "================================================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Movie API Configuration
# Get your free API key from: https://www.themoviedb.org/settings/api

# TMDB API Key (The Movie Database)
# Sign up at https://www.themoviedb.org/ and get your API key
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Development Settings
VITE_APP_ENV=development
VITE_APP_NAME=Sheshnag Divine Tickets

# Debug mode (optional)
VITE_DEBUG=true
EOF
    echo "✅ .env file created!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Go to https://www.themoviedb.org/settings/api"
echo "2. Create an account (free)"
echo "3. Request an API key"
echo "4. Copy your API key"
echo "5. Replace 'your_tmdb_api_key_here' in the .env file with your actual API key"
echo ""
echo "🔧 After adding your API key, restart the development server:"
echo "   npm run dev"
echo ""
echo "🎉 Your app will then automatically fetch real Bollywood movie data!"
