
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
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
      close: "Închide"
    },
    en: {
      title: "Exclude Clichés",
      subtitle: "Uncheck clichés you don't want on your card",
      close: "Close"
    }
  };

  const t = translations[language];

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
      </CardContent>
    </Card>
  );
};

export default ClicheExcluder;
