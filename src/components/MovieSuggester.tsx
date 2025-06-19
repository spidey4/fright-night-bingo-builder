
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Film, Shuffle, Settings, X, Star } from 'lucide-react';
import { searchMoviesByThemes, MovieSuggestion } from '@/utils/tmdbApi';
import { useToast } from '@/hooks/use-toast';

interface MovieSuggesterProps {
  selectedThemes: string[];
  language: 'ro' | 'en';
  onSuggestMovie: (platforms: string[]) => void;
}

const MovieSuggester: React.FC<MovieSuggesterProps> = ({
  selectedThemes,
  language,
  onSuggestMovie
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [tmdbApiKey, setTmdbApiKey] = useState('');
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [suggestedMovies, setSuggestedMovies] = useState<MovieSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const platforms = [
    'Netflix', 'Amazon Prime', 'HBO Max', 'Hulu', 'Disney+', 
    'Apple TV+', 'Paramount+', 'Shudder', 'Tubi', 'YouTube'
  ];

  const translations = {
    ro: {
      title: "Sugerează Filme",
      platforms: "Platforme de Streaming",
      suggest: "Sugerează Filme",
      selectPlatforms: "Selectează platformele tale",
      apiSettings: "Setări API",
      tmdbKey: "TMDB API Key (opțional)",
      tmdbKeyHelp: "Pentru mai multe filme, obține o cheie gratuită de la themoviedb.org",
      getApiKey: "Obține cheie API",
      noMovies: "Nu s-au găsit filme",
      tryDifferent: "Încearcă platforme diferite sau alte teme",
      suggestedMovies: "Filme Sugerate",
      rating: "Rating",
      year: "An"
    },
    en: {
      title: "Movie Suggester",
      platforms: "Streaming Platforms",
      suggest: "Suggest Movies",
      selectPlatforms: "Select your platforms",
      apiSettings: "API Settings",
      tmdbKey: "TMDB API Key (optional)",
      tmdbKeyHelp: "For more movies, get a free key from themoviedb.org",
      getApiKey: "Get API Key",
      noMovies: "No movies found",
      tryDifferent: "Try different platforms or themes",
      suggestedMovies: "Suggested Movies",
      rating: "Rating",
      year: "Year"
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

  const handleSuggestMovies = async () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "Selectează platforme",
        description: "Te rog selectează cel puțin o platformă de streaming.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const movies = await searchMoviesByThemes(selectedThemes, tmdbApiKey || undefined);
      
      // Filter by available platforms (simulated)
      const filteredMovies = movies.filter(movie => 
        movie.platforms.some(platform => selectedPlatforms.includes(platform))
      ).slice(0, 8);

      setSuggestedMovies(filteredMovies);
      
      if (filteredMovies.length === 0) {
        toast({
          title: t.noMovies,
          description: t.tryDifferent,
          variant: "destructive"
        });
      } else {
        // Generate a new bingo card when movies are suggested
        onSuggestMovie(selectedPlatforms);
      }
    } catch (error) {
      console.error('Error suggesting movies:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut obține sugestii de filme.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            {t.title}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowApiSettings(!showApiSettings)}
            className="text-gray-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showApiSettings && (
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              {t.tmdbKey}
            </label>
            <Input
              type="password"
              value={tmdbApiKey}
              onChange={(e) => setTmdbApiKey(e.target.value)}
              placeholder="Introdu cheia TMDB API..."
              className="bg-gray-800 border-gray-600 text-white mb-2"
            />
            <p className="text-xs text-gray-400 mb-2">{t.tmdbKeyHelp}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.themoviedb.org/settings/api', '_blank')}
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              {t.getApiKey}
            </Button>
          </div>
        )}

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
          onClick={handleSuggestMovies}
          disabled={selectedPlatforms.length === 0 || isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          {isLoading ? 'Se caută...' : t.suggest}
        </Button>

        {suggestedMovies.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <Film className="w-5 h-5" />
              {t.suggestedMovies}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {suggestedMovies.map((movie, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex gap-3">
                    {movie.poster && (
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">
                        {movie.title} ({movie.year})
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">{movie.rating}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                        {movie.overview}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {movie.platforms.slice(0, 2).map(platform => (
                          <span key={platform} className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieSuggester;
