# 🚀 Quick API Key Setup Guide

## Step 1: Get Your Free API Key

1. **Go to TMDB**: https://www.themoviedb.org/settings/api
2. **Create Account**: Sign up for a free account
3. **Request API Key**: Click "Request API Key"
4. **Fill Form**: 
   - Developer Name: Your name
   - Application Name: "Sheshnag Divine Tickets"
   - Application URL: http://localhost:8080
   - Application Summary: "Movie booking application for Bollywood movies"
5. **Submit**: Click "Submit"
6. **Copy Key**: Copy your API key (it looks like: `1234567890abcdef1234567890abcdef`)

## Step 2: Add API Key to Your Project

1. **Open `.env` file** in your project root
2. **Replace** `your_tmdb_api_key_here` with your actual API key:
   ```env
   VITE_TMDB_API_KEY=1234567890abcdef1234567890abcdef
   ```
3. **Save the file**

## Step 3: Restart Your App

```bash
npm run dev
```

## Step 4: Test the API

1. **Open your app**: http://localhost:8080
2. **Click "API Status"** button in the header
3. **Check status**: Should show "API Connected" with movie count

## 🎉 You're Done!

Your app will now automatically fetch real Bollywood movies with:
- ✅ Latest movie releases
- ✅ High-quality posters
- ✅ Real ratings and reviews
- ✅ Cast information
- ✅ Release dates

## 🔧 Troubleshooting

**If you see "No API Key":**
- Make sure you saved the `.env` file
- Restart the development server
- Check that the API key is correct

**If you see "API Error":**
- Check your internet connection
- Verify the API key is valid
- Try the "Test Again" button

## 📊 What You Get

With the API connected, your app will show:
- **Real Bollywood movies** from TMDB database
- **Auto-updating content** as new movies are added
- **Search functionality** across all movies
- **Filtering and sorting** options
- **High-quality movie posters**

The API is completely free and includes 1,000 requests per day - more than enough for development and testing!
