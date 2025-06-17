
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Ban, RotateCcw } from 'lucide-react';
import { BingoIdea } from '@/data/bingoData';

interface ClicheExcluderProps {
  allIdeas: BingoIdea[];
  excludedIdeas: string[];
  onToggleExclude: (ideaText: string) => void;
  onClose: () => void;
  language: 'ro' | 'en';
}

const ClicheExcluder: React.FC<ClicheExcluderProps> = ({
  allIdeas,
  excludedIdeas,
  onToggleExclude,
  onClose,
  language
}) => {
  const translations = {
    ro: {
      title: "Excludere Clișee",
      subtitle: "Debifează clișeele pe care nu le vrei pe card",
      close: "Închide",
      excludeAll: "Exclude Toate",
      includeAll: "Include Toate",
      noClichesMode: "Mod Fără Clișee"
    },
    en: {
      title: "Exclude Clichés",
      subtitle: "Uncheck clichés you don't want on your card",
      close: "Close",
      excludeAll: "Exclude All",
      includeAll: "Include All",
      noClichesMode: "No Clichés Mode"
    }
  };

  const t = translations[language];

  const handleExcludeAll = () => {
    allIdeas.forEach(idea => {
      const ideaText = idea[language];
      if (!excludedIdeas.includes(ideaText)) {
        onToggleExclude(ideaText);
      }
    });
  };

  const handleIncludeAll = () => {
    excludedIdeas.forEach(ideaText => {
      onToggleExclude(ideaText);
    });
  };

  return (
    <Card className="bg-gray-900/90 border-red-600/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-red-400">{t.title}</CardTitle>
          <p className="text-sm text-gray-300 mt-1">{t.subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            onClick={handleExcludeAll}
            variant="outline"
            size="sm"
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            disabled={excludedIdeas.length === allIdeas.length}
          >
            <Ban className="w-4 h-4 mr-2" />
            {t.excludeAll}
          </Button>
          <Button
            onClick={handleIncludeAll}
            variant="outline"
            size="sm"
            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            disabled={excludedIdeas.length === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.includeAll}
          </Button>
        </div>
        
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {allIdeas.map((idea, index) => {
              const ideaText = idea[language];
              const isExcluded = excludedIdeas.includes(ideaText);
              
              return (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`idea-${index}`}
                    checked={!isExcluded}
                    onCheckedChange={() => onToggleExclude(ideaText)}
                    className="border-gray-600"
                  />
                  <label
                    htmlFor={`idea-${index}`}
                    className={`text-sm cursor-pointer ${
                      isExcluded ? 'text-gray-500 line-through' : 'text-gray-200'
                    }`}
                  >
                    {ideaText}
                  </label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {excludedIdeas.length === allIdeas.length && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-600/40 rounded-lg">
            <p className="text-red-400 text-sm font-medium">⚠️ {t.noClichesMode}</p>
            <p className="text-red-300 text-xs mt-1">
              {language === 'ro' 
                ? "Toate clișeele sunt excluse. Cardul va conține doar spații libere."
                : "All clichés are excluded. The card will contain only free spaces."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClicheExcluder;
