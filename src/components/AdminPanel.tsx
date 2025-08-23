import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, X } from 'lucide-react';
import { Movie } from '@/services/movieApi';

interface AdminPanelProps {
  onAddMovie: (movie: Omit<Movie, 'id'>) => void;
  onClose: () => void;
}

export const AdminPanel = ({ onAddMovie, onClose }: AdminPanelProps) => {
  const [formData, setFormData] = useState({
    title: '',
    poster: '',
    rating: '',
    duration: '',
    genre: '',
    description: '',
    releaseDate: '',
    director: '',
    cast: '',
    language: 'Hindi'
  });

  const [showtimes, setShowtimes] = useState(['12:00PM', '3:00PM', '6:00PM', '9:00PM']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMovie: Omit<Movie, 'id'> = {
      title: formData.title,
      poster: formData.poster,
      rating: parseFloat(formData.rating),
      duration: formData.duration,
      genre: formData.genre,
      showtimes,
      description: formData.description,
      releaseDate: formData.releaseDate,
      director: formData.director,
      cast: formData.cast.split(',').map(s => s.trim()).filter(Boolean),
      language: formData.language
    };

    onAddMovie(newMovie);
    
    // Reset form
    setFormData({
      title: '',
      poster: '',
      rating: '',
      duration: '',
      genre: '',
      description: '',
      releaseDate: '',
      director: '',
      cast: '',
      language: 'Hindi'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add New Movie</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Movie Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter movie title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="poster">Poster URL *</Label>
                <Input
                  id="poster"
                  value={formData.poster}
                  onChange={(e) => handleInputChange('poster', e.target.value)}
                  placeholder="https://example.com/poster.jpg"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="rating">Rating (0-10) *</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  placeholder="8.5"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="2h 30min"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="genre">Genre *</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  placeholder="Action, Drama"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  placeholder="Hindi"
                />
              </div>
              
              <div>
                <Label htmlFor="director">Director</Label>
                <Input
                  id="director"
                  value={formData.director}
                  onChange={(e) => handleInputChange('director', e.target.value)}
                  placeholder="Director name"
                />
              </div>
              
              <div>
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cast">Cast (comma-separated)</Label>
              <Input
                id="cast"
                value={formData.cast}
                onChange={(e) => handleInputChange('cast', e.target.value)}
                placeholder="Actor 1, Actor 2, Actor 3"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter movie description..."
                rows={3}
                required
              />
            </div>
            
            <div>
              <Label>Show Times</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {showtimes.map((time, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {time}
                    <button
                      type="button"
                      onClick={() => setShowtimes(prev => prev.filter((_, i) => i !== index))}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowtimes(prev => [...prev, '10:00PM'])}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Time
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Add Movie
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
