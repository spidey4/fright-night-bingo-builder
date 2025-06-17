
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Heart, Trash2, Star } from 'lucide-react';
import { BingoIdea } from '@/data/bingoData';

interface FavoriteCard {
  id: string;
  ideas: BingoIdea[];
  timestamp: number;
  language: 'ro' | 'en';
}

interface FavoriteCardsProps {
  language: 'ro' | 'en';
  onClose: () => void;
  favoriteCards: FavoriteCard[];
  onRemoveFavorite: (cardId: string) => void;
  onLoadCard: (card: FavoriteCard) => void;
}

const FavoriteCards: React.FC<FavoriteCardsProps> = ({
  language,
  onClose,
  favoriteCards,
  onRemoveFavorite,
  onLoadCard
}) => {
  const translations = {
    ro: {
      title: "Carduri Favorite",
      subtitle: "Cardurile tale salvate",
      close: "Închide",
      noFavorites: "Nu ai carduri favorite încă",
      loadCard: "Încarcă Card",
      remove: "Șterge",
      savedOn: "Salvat pe"
    },
    en: {
      title: "Favorite Cards",
      subtitle: "Your saved cards",
      close: "Close",
      noFavorites: "No favorite cards yet",
      loadCard: "Load Card",
      remove: "Remove",
      savedOn: "Saved on"
    }
  };

  const t = translations[language];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US');
  };

  return (
    <Card className="bg-gray-900/90 border-pink-600/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-pink-400 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {t.title}
          </CardTitle>
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
        {favoriteCards.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">{t.noFavorites}</p>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {favoriteCards.map((card) => (
                <div key={card.id} className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      {t.savedOn} {formatDate(card.timestamp)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onLoadCard(card)}
                        className="bg-pink-600 hover:bg-pink-700"
                      >
                        {t.loadCard}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveFavorite(card.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {card.ideas.slice(0, 6).map((idea, index) => (
                      <div key={index} className="text-gray-300 truncate">
                        {idea[language]}
                      </div>
                    ))}
                    {card.ideas.length > 6 && (
                      <div className="text-gray-500">...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteCards;
