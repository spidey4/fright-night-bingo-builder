
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skull, Settings, FileText, Filter, Film, Users, QrCode } from 'lucide-react';

interface BingoHeaderProps {
  language: 'ro' | 'en';
  isSharedCard: boolean;
  importedIdeas: string[];
  showSettings: boolean;
  onToggleSettings: () => void;
  onToggleIdeaImporter: () => void;
  onToggleClicheExcluder: () => void;
  onToggleMovieSuggester: () => void;
  onToggleVSMode: () => void;
  onToggleQRCode: () => void;
  onCreateNew: () => void;
  onClearImportedIdeas: () => void;
  hasBingoCard: boolean;
}

const BingoHeader: React.FC<BingoHeaderProps> = ({
  language,
  isSharedCard,
  importedIdeas,
  showSettings,
  onToggleSettings,
  onToggleIdeaImporter,
  onToggleClicheExcluder,
  onToggleMovieSuggester,
  onToggleVSMode,
  onToggleQRCode,
  onCreateNew,
  onClearImportedIdeas,
  hasBingoCard
}) => {
  const translations = {
    ro: {
      title: "Horror Bingo",
      subtitle: "Jocul perfect pentru seara de filme horror!",
      madeFor: "made for my perfect girlfriend Elena",
      settings: "Setări",
      hideSettings: "Ascunde Setări",
      excludeCliches: "Excludere Clișee",
      movieSuggester: "Sugerează Film",
      vsMode: "Modul VS",
      qrCode: "Cod QR",
      sharedCard: "Card Partajat",
      createNew: "Creează Card Nou"
    },
    en: {
      title: "Horror Bingo",
      subtitle: "The perfect game for horror movie nights!",
      madeFor: "made for my perfect girlfriend Elena",
      settings: "Settings",
      hideSettings: "Hide Settings",
      excludeCliches: "Exclude Clichés",
      movieSuggester: "Movie Suggester",
      vsMode: "VS Mode",
      qrCode: "QR Code",
      sharedCard: "Shared Card",
      createNew: "Create New Card"
    }
  };

  const t = translations[language];

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Skull className="w-12 h-12 text-red-500" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <Skull className="w-12 h-12 text-red-500" />
      </div>
      <p className="text-xl text-gray-300 mb-4">{t.subtitle}</p>
      <p className="text-sm text-pink-300 italic mb-6">✨ {t.madeFor} ✨</p>
      
      {isSharedCard && (
        <div className="mb-4">
          <Badge variant="outline" className="border-green-500/30 text-green-400 mb-2">
            {t.sharedCard}
          </Badge>
          <div>
            <Button
              onClick={onCreateNew}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              {t.createNew}
            </Button>
          </div>
        </div>
      )}

      {importedIdeas.length > 0 && (
        <div className="mb-4">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 mb-2">
            Card Custom ({importedIdeas.length} idei)
          </Badge>
          <div>
            <Button
              onClick={onClearImportedIdeas}
              variant="outline"
              size="sm"
              className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
            >
              Revino la teme standard
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex gap-2 justify-center flex-wrap mb-6">
        <Button
          onClick={onToggleSettings}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          {showSettings ? t.hideSettings : t.settings}
        </Button>

        <Button
          onClick={onToggleIdeaImporter}
          variant="outline"
          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          Import Idei
        </Button>
        
        <Button
          onClick={onToggleClicheExcluder}
          variant="outline"
          className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
        >
          <Filter className="w-4 h-4 mr-2" />
          {t.excludeCliches}
        </Button>
        
        <Button
          onClick={onToggleMovieSuggester}
          variant="outline"
          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
        >
          <Film className="w-4 h-4 mr-2" />
          {t.movieSuggester}
        </Button>
        
        <Button
          onClick={onToggleVSMode}
          variant="outline"
          className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
        >
          <Users className="w-4 h-4 mr-2" />
          {t.vsMode}
        </Button>

        {hasBingoCard && (
          <Button
            onClick={onToggleQRCode}
            variant="outline"
            className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
          >
            <QrCode className="w-4 h-4 mr-2" />
            {t.qrCode}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BingoHeader;
