# 🎬 Sheshnag Divine Tickets - Movie Booking App

A modern, responsive movie booking application with real-time Bollywood movie data from TMDB API.

## ✨ Features

- 🎭 **Real Bollywood Movies**: Live data from TMDB API
- 🎫 **Booking System**: Complete ticket booking functionality
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Beautiful, professional interface
- ⚡ **Fast Performance**: Built with Vite and React
- 🔄 **Auto-Updating**: Latest movies automatically appear

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- TMDB API Key (optional, for real movie data)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AadiVj18/sheshnag-divine-tickets.git
   cd sheshnag-divine-tickets
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   echo "VITE_TMDB_API_KEY=your_tmdb_api_key_here" > .env
   ```
   
   **Get TMDB API Key:**
   - Go to [TMDB](https://www.themoviedb.org/settings/api)
   - Create an account and request API access
   - Copy your API key and replace `your_tmdb_api_key_here`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - Add `VITE_TMDB_API_KEY` with your actual API key
   - Click "Deploy"

3. **Your app will be live!**
   - Vercel will give you a URL like: `https://your-app.vercel.app`
   - Automatic deployments on every push to main branch

### Alternative: Deploy to Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variable: `VITE_TMDB_API_KEY`
   - Click "Deploy site"

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **API**: TMDB (The Movie Database)
- **Deployment**: Vercel/Netlify
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Header.tsx      # App header
│   ├── MovieCard.tsx   # Movie display card
│   └── BookingForm.tsx # Booking form
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   └── BookingPage.tsx # Booking page
├── hooks/              # Custom React hooks
├── services/           # API services
└── assets/             # Static assets
```

## 🎯 Key Features

### Movie Display
- Real-time movie data from TMDB
- High-quality movie posters
- Ratings and reviews
- Show times and duration
- Genre information

### Booking System
- User-friendly booking form
- Multiple ticket selection
- Show time selection
- Form validation
- Success confirmations

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface
- Fast loading times

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_TMDB_API_KEY` | TMDB API key for movie data | No (uses fallback data) |

## 📱 API Integration

The app integrates with TMDB API to fetch:
- Latest Bollywood movies
- Movie posters and details
- Ratings and reviews
- Movie descriptions

If no API key is provided, the app uses fallback data for demonstration.

## 🚀 Performance

- **Fast Loading**: Vite for instant hot reload
- **Optimized Images**: Lazy loading for posters
- **Minimal Bundle**: Tree-shaking and code splitting
- **CDN Delivery**: Global content delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data
- [Shadcn/ui](https://ui.shadcn.com/) for UI components
- [Vite](https://vitejs.dev/) for build tool
- [React](https://reactjs.org/) for the framework

---

**Made with ❤️ for the divine entertainment experience**
