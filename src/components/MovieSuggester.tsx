
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Film, Shuffle } from 'lucide-react';

interface MovieSuggesterProps {
  selectedTheme: string;
  language: 'ro' | 'en';
  onSuggestMovie: (platforms: string[]) => void;
}

const MovieSuggester: React.FC<MovieSuggesterProps> = ({
  selectedTheme,
  language,
  onSuggestMovie
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const platforms = [
    'Netflix', 'Amazon Prime', 'HBO Max', 'Hulu', 'Disney+', 
    'Apple TV+', 'Paramount+', 'Shudder', 'Tubi', 'YouTube'
  ];

  const translations = {
    ro: {
      title: "Sugerează Film Random",
      platforms: "Platforme de Streaming",
      suggest: "Sugerează Film",
      selectPlatforms: "Selectează platformele tale"
    },
    en: {
      title: "Suggest Random Movie",
      platforms: "Streaming Platforms",
      suggest: "Suggest Movie",
      selectPlatforms: "Select your platforms"
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

  return (
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
          onClick={() => onSuggestMovie(selectedPlatforms)}
          disabled={selectedPlatforms.length === 0}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          {t.suggest}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieSuggester;
