
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Film, X, Key, AlertCircle } from 'lucide-react';
import { searchMoviesByThemes } from '@/utils/tmdbApi';
import { useToast } from '@/hooks/use-toast';

interface MovieSuggesterProps {
  selectedThemes: string[];
  language: 'ro' | 'en';
  onSuggestMovie: (platforms: string[]) => void;
}

const MovieSuggester = ({ selectedThemes, language, onSuggestMovie }: MovieSuggesterProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { toast } = useToast();

  const platforms = [
    'Netflix', 'Amazon Prime', 'HBO Max', 'Hulu', 'Disney+', 
    'Apple TV+', 'Paramount+', 'Shudder'
  ];

  const translations = {
    ro: {
      title: "Sugerează Film Horror",
      subtitle: "Selectează platformele pe care ai acces",
      platforms: "Platforme disponibile",
      suggestMovie: "Sugerează Film",
      close: "Închide",
      noMovieFound: "Nu s-a găsit film",
      tryDifferent: "Încearcă să selectezi mai multe platforme sau alte teme.",
      apiKeyTitle: "API Key TMDB (Opțional)",
      apiKeyDescription: "Pentru sute de sugestii de filme, introdu API key-ul tău TMDB gratuit:",
      getApiKey: "Obține API Key Gratuit",
      enterApiKey: "Introdu API Key",
      hideApiKey: "Ascunde",
      withoutApiKey: "Fără API key vei primi doar câteva filme din baza noastră locală.",
      foundMovies: "filme găsite",
      searching: "Se caută..."
    },
    en: {
      title: "Horror Movie Suggester",
      subtitle: "Select your available streaming platforms",
      platforms: "Available platforms",
      suggestMovie: "Suggest Movie",
      close: "Close",
      noMovieFound: "No movie found",
      tryDifferent: "Try selecting more platforms or different themes.",
      apiKeyTitle: "TMDB API Key (Optional)",
      apiKeyDescription: "For hundreds of movie suggestions, enter your free TMDB API key:",
      getApiKey: "Get Free API Key",
      enterApiKey: "Enter API Key",
      hideApiKey: "Hide",
      withoutApiKey: "Without API key you'll get only a few movies from our local database.",
      foundMovies: "movies found",
      searching: "Searching..."
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
    if (selectedPlatforms.length === 0) {
      toast({
        title: "Selectează platforme",
        description: "Te rog selectează cel puțin o platformă.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const movies = await searchMoviesByThemes(selectedThemes, apiKey);
      console.log('Movies found:', movies.length, movies);
      
      if (movies.length > 0) {
        // Filter by available platforms
        const availableMovies = movies.filter(movie => 
          movie.platforms.some(platform => selectedPlatforms.includes(platform))
        );
        
        console.log('Available movies after platform filter:', availableMovies.length, availableMovies);
        
        if (availableMovies.length > 0) {
          const randomMovie = availableMovies[Math.floor(Math.random() * availableMovies.length)];
          
          // Show detailed movie suggestion
          toast({
            title: `🎬 ${randomMovie.title} (${randomMovie.year})`,
            description: `⭐ ${randomMovie.rating}/10\n📺 ${randomMovie.platforms.join(', ')}\n\n${randomMovie.overview.slice(0, 150)}${randomMovie.overview.length > 150 ? '...' : ''}`,
            duration: 10000,
          });
          
          // Show count of movies found
          toast({
            title: `${movies.length} ${t.foundMovies}`,
            description: `${availableMovies.length} disponibile pe platformele tale${apiKey ? ' (Cu TMDB API)' : ' (Din baza locală)'}`,
          });
        } else {
          toast({
            title: t.noMovieFound,
            description: `${movies.length} ${t.foundMovies}, dar niciunul pe platformele selectate. ${t.tryDifferent}`,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: t.noMovieFound,
          description: t.tryDifferent,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error suggesting movie:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la căutarea filmelor. Încearcă din nou.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/70 border-blue-600/40 backdrop-blur-sm shadow-lg shadow-blue-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Film className="w-5 h-5" />
            {t.title}
          </CardTitle>
          <Button
            onClick={() => onSuggestMovie([])}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* TMDB API Key Section */}
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-medium mb-1">{t.apiKeyTitle}</h4>
              <p className="text-sm text-gray-300 mb-2">{t.apiKeyDescription}</p>
              <p className="text-xs text-gray-400">{t.withoutApiKey}</p>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => window.open('https://www.themoviedb.org/settings/api', '_blank')}
              variant="outline"
              size="sm"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white text-xs"
            >
              <Key className="w-3 h-3 mr-1" />
              {t.getApiKey}
            </Button>
            
            <Button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white text-xs"
            >
              {showApiKeyInput ? t.hideApiKey : t.enterApiKey}
            </Button>
          </div>
          
          {showApiKeyInput && (
            <div className="mt-3">
              <Input
                type="password"
                placeholder="Introdu TMDB API Key aici..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-gray-800/80 border-gray-600 text-white text-sm"
              />
            </div>
          )}
        </div>

        <p className="text-gray-300 mb-4 text-sm sm:text-base">{t.subtitle}</p>
        
        <h4 className="text-white font-medium mb-3">{t.platforms}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
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

        {selectedPlatforms.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium mb-2 text-gray-300">Platforme selectate:</h5>
            <div className="flex gap-2 flex-wrap">
              {selectedPlatforms.map(platform => (
                <Badge key={platform} variant="secondary" className="bg-blue-600/20 text-blue-300">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={handleSuggestMovie}
          disabled={isLoading || selectedPlatforms.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30"
        >
          <Film className="w-4 h-4 mr-2" />
          {isLoading ? t.searching : t.suggestMovie}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieSuggester;
