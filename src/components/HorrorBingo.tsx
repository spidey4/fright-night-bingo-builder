
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skull, RefreshCw, Edit3, Save, X, Settings, Download, Filter, Users, Film, QrCode, ChevronDown, ChevronUp, Plus, Trash2, Upload } from 'lucide-react';
import { bingoThemes, BingoIdea } from '@/data/bingoData';
import StardustLogo from '@/components/StardustLogo';
import DifficultySlider from '@/components/DifficultySlider';
import ClicheExcluder from '@/components/ClicheExcluder';
import MovieSuggester from '@/components/MovieSuggester';
import VSMode from '@/components/VSMode';
import QRCodeShare from '@/components/QRCodeShare';
import IdeaImporter from '@/components/IdeaImporter';
import { downloadBingoCard } from '@/utils/downloadCard';
import { suggestRandomMovie } from '@/utils/movieSuggester';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';

// ... keep existing code (type definitions and interfaces)

const HorrorBingo = () => {
  // ... keep existing code (all state declarations and optional themes)

  const translations = {
    ro: {
      title: "Horror Bingo",
      subtitle: "Jocul perfect pentru seara de filme horror!",
      language: "Limbă",
      themes: "Teme filme",
      cardSize: "Mărimea cardului",
      generateCard: "Generează Card",
      resetCard: "Resetează Card",
      downloadCard: "Descarcă Card",
      settings: "Setări",
      hideSettings: "Ascunde Setări",
      showThemes: "Arată Teme",
      hideThemes: "Ascunde Teme",
      editCell: "Editează",
      saveCell: "Salvează",
      cancelEdit: "Anulează",
      madeFor: "made for my perfect girlfriend Elena",
      excludeCliches: "Excludere Clișee",
      movieSuggester: "Sugerează Film",
      vsMode: "Modul VS",
      winner: "Câștigător",
      suggestedMovie: "Film sugerat",
      qrCode: "Cod QR",
      sharedCard: "Card Partajat",
      createNew: "Creează Card Nou",
      cursedDollOption: "Include elemente păpușă blestemată",
      jumpscareOption: "Include jump scare-uri clasice",
      gothicOption: "Include elemente gotice",
      cultOption: "Include culte și ritualuri",
      zombieOption: "Include elemente zombie",
      selectMultiple: "Selectează mai multe teme pentru varietate",
      optionalThemes: "Teme Opționale",
      customThemes: "Teme Personalizate",
      createCustomTheme: "Creează Temă Nouă",
      themeName: "Numele temei",
      themeIdeas: "Idei pentru temă",
      addIdea: "Adaugă Idee",
      removeIdea: "Șterge Idee",
      saveTheme: "Salvează Tema",
      cancelTheme: "Anulează",
      importIdeas: "Importă Idei",
      useImportedIdeas: "Folosește idei importate pentru card"
    },
    en: {
      title: "Horror Bingo",
      subtitle: "The perfect game for horror movie nights!",
      language: "Language",
      themes: "Movie themes",
      cardSize: "Card size",
      generateCard: "Generate Card",
      resetCard: "Reset Card",
      downloadCard: "Download Card",
      settings: "Settings",
      hideSettings: "Hide Settings",
      showThemes: "Show Themes",
      hideThemes: "Hide Themes",
      editCell: "Edit",
      saveCell: "Save",
      cancelEdit: "Cancel",
      madeFor: "made for my perfect girlfriend Elena",
      excludeCliches: "Exclude Clichés",
      movieSuggester: "Movie Suggester",
      vsMode: "VS Mode",
      winner: "Winner",
      suggestedMovie: "Suggested movie",
      qrCode: "QR Code",
      sharedCard: "Shared Card",
      createNew: "Create New Card",
      cursedDollOption: "Include cursed doll elements",
      jumpscareOption: "Include classic jump scares",
      gothicOption: "Include gothic elements",
      cultOption: "Include cults & rituals",
      zombieOption: "Include zombie elements",
      selectMultiple: "Select multiple themes for variety",
      optionalThemes: "Optional Themes",
      customThemes: "Custom Themes",
      createCustomTheme: "Create New Theme",
      themeName: "Theme name",
      themeIdeas: "Theme ideas",
      addIdea: "Add Idea",
      removeIdea: "Remove Idea",
      saveTheme: "Save Theme",
      cancelTheme: "Cancel",
      importIdeas: "Import Ideas",
      useImportedIdeas: "Use imported ideas for card"
    }
  };

  const t = translations[language];

  // ... keep existing code (useEffect for loading shared card)

  const generateBingoCard = () => {
    let allIdeas: BingoIdea[] = [];
    
    // Check if we should use imported ideas
    if (importedIdeas.length > 0) {
      const importedBingoIdeas: BingoIdea[] = importedIdeas.map(idea => ({
        ro: idea,
        en: idea
      }));
      allIdeas = importedBingoIdeas;
    } else {
      // ... keep existing code (collect ideas from selected themes and optional themes)
    }
    
    // ... keep existing code (rest of generateBingoCard function)
  };

  // ... keep existing code (all other functions until handleImportIdeas)

  const handleImportIdeas = (ideas: string[]) => {
    setImportedIdeas(ideas);
    setSelectedThemes([]); // Clear selected themes when using imported ideas
    toast({
      title: "Idei importate!",
      description: `${ideas.length} idei au fost încărcate cu succes.`,
    });
  };

  const clearImportedIdeas = () => {
    setImportedIdeas([]);
    setSelectedThemes(['slasher']); // Reset to default theme
    toast({
      title: "Idei șterse",
      description: "Ideile importate au fost șterse. Revenit la temele standard.",
    });
  };

  // ... keep existing code (useEffect)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-4">
      <StardustLogo />
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
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
                  onClick={generateBingoCard}
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                >
                  {t.createNew}
                </Button>
              </div>
            </div>
          )}
          
          {/* Imported Ideas Status */}
          {importedIdeas.length > 0 && (
            <div className="mb-4">
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 mb-2">
                {importedIdeas.length} idei importate
              </Badge>
              <div>
                <Button
                  onClick={clearImportedIdeas}
                  variant="outline"
                  size="sm"
                  className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
                >
                  Șterge idei importate
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 justify-center flex-wrap mb-6">
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showSettings ? t.hideSettings : t.settings}
            </Button>
            
            <Button
              onClick={() => setShowIdeaImporter(!showIdeaImporter)}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t.importIdeas}
            </Button>
            
            <Button
              onClick={() => setShowClicheExcluder(!showClicheExcluder)}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              {t.excludeCliches}
            </Button>
            
            <Button
              onClick={() => setShowMovieSuggester(!showMovieSuggester)}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              <Film className="w-4 h-4 mr-2" />
              {t.movieSuggester}
            </Button>
            
            <Button
              onClick={() => setShowVSMode(!showVSMode)}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              {t.vsMode}
            </Button>

            {bingoCard.length > 0 && (
              <Button
                onClick={() => setShowQRCode(!showQRCode)}
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
              >
                <QrCode className="w-4 h-4 mr-2" />
                {t.qrCode}
              </Button>
            )}
          </div>
        </div>

        {/* Feature Panels */}
        <div className="grid gap-6 mb-8">
          {showIdeaImporter && (
            <IdeaImporter
              language={language}
              onImportIdeas={handleImportIdeas}
              onClose={() => setShowIdeaImporter(false)}
            />
          )}
          
          {showClicheExcluder && (
            <ClicheExcluder
              allIdeas={selectedThemes.flatMap(theme => bingoThemes[theme]?.ideas || [])}
              excludedIdeas={excludedIdeas}
              onToggleExclude={toggleExcludedIdea}
              onClose={() => setShowClicheExcluder(false)}
              language={language}
            />
          )}
          
          {showMovieSuggester && (
            <MovieSuggester
              selectedTheme={selectedThemes[0] || 'slasher'}
              language={language}
              onSuggestMovie={handleMovieSuggestion}
            />
          )}
          
          {showVSMode && (
            <VSMode
              language={language}
              onStartVSGame={startVSGame}
              gameState={vsGameState}
              onBingo={handleBingo}
            />
          )}

          {showQRCode && bingoCard.length > 0 && (
            <QRCodeShare
              bingoCard={bingoCard}
              language={language}
              selectedThemes={selectedThemes}
              cardSize={cardSize}
              onClose={() => setShowQRCode(false)}
            />
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="mb-8 bg-gray-900/70 border-red-600/40 backdrop-blur-sm shadow-lg shadow-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Skull className="w-5 h-5" />
                {t.settings}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* ... keep existing code (settings content) */}
            </CardContent>
          </Card>
        )}

        {/* Bingo Card */}
        {bingoCard.length > 0 && (
          <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm shadow-2xl shadow-red-900/30">
            <CardContent className="p-6">
              {/* ... keep existing code (bingo card content) */}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <Badge variant="outline" className="border-red-500/30 text-red-400">
            Made for horror movie enthusiasts 🎬
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default HorrorBingo;
