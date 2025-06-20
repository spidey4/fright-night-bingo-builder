
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Film, Shuffle, ExternalLink } from 'lucide-react';
import { suggestRandomMovie, suggestRandomMovieFallback, Movie } from '@/utils/movieSuggester';
import { toast } from '@/components/ui/use-toast';

interface MovieSuggesterProps {
  selectedTheme: string;
  language: 'ro' | 'en';
}

const MovieSuggester: React.FC<MovieSuggesterProps> = ({
  selectedTheme,
  language
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [suggestedMovie, setSuggestedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const platforms = [
    'Netflix', 'Amazon Prime', 'HBO Max', 'Hulu', 'Disney+', 
    'Apple TV+', 'Paramount+', 'Shudder', 'Tubi'
  ];

  const translations = {
    ro: {
      title: "Sugerează Film Random",
      platforms: "Platforme de Streaming",
      suggest: "Sugerează Film",
      selectPlatforms: "Selectează platformele tale",
      movieSuggestion: "Film Sugerat",
      noMovie: "Nu s-a găsit niciun film",
      apiKeyMissing: "Cheia API TMDB lipsește - folosind filmele locale",
      error: "Eroare la obținerea filmului"
    },
    en: {
      title: "Suggest Random Movie",
      platforms: "Streaming Platforms",
      suggest: "Suggest Movie",
      selectPlatforms: "Select your platforms",
      movieSuggestion: "Suggested Movie",
      noMovie: "No movie found",
      apiKeyMissing: "TMDB API key missing - using local movies",
      error: "Error fetching movie"
    }
  };

  const t = translations[language];

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSuggestMovie = async () => {
    if (selectedPlatforms.length === 0) return;

    setIsLoading(true);
    setSuggestedMovie(null);

    try {
      // Try TMDB API first
      const movie = await suggestRandomMovie(selectedTheme, selectedPlatforms);
      
      if (movie) {
        setSuggestedMovie(movie);
      } else {
        // Fallback to local movies
        const fallbackMovie = suggestRandomMovieFallback(selectedTheme, selectedPlatforms);
        if (fallbackMovie) {
          setSuggestedMovie(fallbackMovie);
          toast({
            title: t.apiKeyMissing,
            description: "Add your TMDB API key in movieSuggester.ts for real-time suggestions"
          });
        } else {
          toast({
            title: t.noMovie,
            description: "Try selecting different platforms or themes"
          });
        }
      }
    } catch (error) {
      console.error('Movie suggestion error:', error);
      toast({
        title: t.error,
        description: "Please try again"
      });
      
      // Try fallback
      const fallbackMovie = suggestRandomMovieFallback(selectedTheme, selectedPlatforms);
      if (fallbackMovie) {
        setSuggestedMovie(fallbackMovie);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Film className="w-5 h-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              {t.platforms}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(platform => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform}
                    checked={selectedPlatforms.includes(platform)}
                    onCheckedChange={() => togglePlatform(platform)}
                    className="border-gray-600"
                  />
                  <label
                    htmlFor={platform}
                    className="text-sm text-gray-200 cursor-pointer"
                  >
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            onClick={handleSuggestMovie}
            disabled={selectedPlatforms.length === 0 || isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            {isLoading ? 'Loading...' : t.suggest}
          </Button>
        </CardContent>
      </Card>

      {suggestedMovie && (
        <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Film className="w-5 h-5" />
              {t.movieSuggestion}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {suggestedMovie.poster && (
                <img 
                  src={suggestedMovie.poster} 
                  alt={suggestedMovie.title}
                  className="w-24 h-36 object-cover rounded-md flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  {suggestedMovie.title} ({suggestedMovie.year})
                </h3>
                {suggestedMovie.description && (
                  <p className="text-gray-300 text-sm mb-2 line-clamp-3">
                    {suggestedMovie.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mb-2">
                  {suggestedMovie.platforms.map(platform => (
                    <span 
                      key={platform} 
                      className="px-2 py-1 bg-red-600/20 text-red-300 text-xs rounded-full"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
                {suggestedMovie.tmdbId && (
                  <a 
                    href={`https://www.themoviedb.org/movie/${suggestedMovie.tmdbId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                  >
                    View on TMDB <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MovieSuggester;
