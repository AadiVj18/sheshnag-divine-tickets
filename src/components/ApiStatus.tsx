import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { fetchMoviesFromAPI } from '@/services/movieApi';

interface ApiStatusProps {
  onClose: () => void;
}

export const ApiStatus = ({ onClose }: ApiStatusProps) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-key'>('loading');
  const [message, setMessage] = useState('');
  const [movieCount, setMovieCount] = useState(0);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setStatus('loading');
    setMessage('Checking API status...');

    try {
      // Check if API key is configured
      const key = import.meta.env.VITE_TMDB_API_KEY;
      setApiKey(key);

      if (!key || key === 'your_tmdb_api_key_here') {
        setStatus('no-key');
        setMessage('No API key configured. Using local movie data.');
        return;
      }

      // Test API call
      const movies = await fetchMoviesFromAPI();
      setMovieCount(movies.length);
      
      if (movies.length > 0) {
        setStatus('success');
        setMessage(`Successfully fetched ${movies.length} movies from TMDB API!`);
      } else {
        setStatus('error');
        setMessage('API call succeeded but no movies returned.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'no-key':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'no-key':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>API Status Check</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <span className={`font-medium ${getStatusColor()}`}>
              {status === 'loading' && 'Checking...'}
              {status === 'success' && 'API Connected'}
              {status === 'error' && 'API Error'}
              {status === 'no-key' && 'No API Key'}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{message}</p>

          {status === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your app is now using real movie data from TMDB!
              </AlertDescription>
            </Alert>
          )}

          {status === 'no-key' && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <div className="space-y-2">
                  <p>To get real movie data:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Get a free API key from <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="underline">TMDB</a></li>
                    <li>Add it to your .env file</li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                There was an error connecting to the API. Check your internet connection and API key.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>API Key:</span>
              <Badge variant={apiKey && apiKey !== 'your_tmdb_api_key_here' ? 'default' : 'secondary'}>
                {apiKey && apiKey !== 'your_tmdb_api_key_here' ? 'Configured' : 'Not Set'}
              </Badge>
            </div>
            
            {status === 'success' && (
              <div className="flex justify-between text-sm">
                <span>Movies Fetched:</span>
                <Badge variant="outline">{movieCount}</Badge>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={checkApiStatus} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Test Again
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
