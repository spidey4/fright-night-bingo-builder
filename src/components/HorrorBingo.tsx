
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Skull, RefreshCw, Edit3, Save, X, Settings, Download, Filter, Users, Film, QrCode } from 'lucide-react';
import { bingoThemes, BingoIdea } from '@/data/bingoData';
import StardustLogo from '@/components/StardustLogo';
import DifficultySlider from '@/components/DifficultySlider';
import ClicheExcluder from '@/components/ClicheExcluder';
import MovieSuggester from '@/components/MovieSuggester';
import VSMode from '@/components/VSMode';
import QRCodeShare from '@/components/QRCodeShare';
import { downloadBingoCard } from '@/utils/downloadCard';
import { suggestRandomMovie } from '@/utils/movieSuggester';
import { useToast } from '@/hooks/use-toast';

type Language = 'ro' | 'en';
type CardSize = 3 | 4 | 5;

interface BingoCell {
  idea: BingoIdea;
  isChecked: boolean;
  isEditing: boolean;
  editedText: string;
}

interface VSGameState {
  isActive: boolean;
  player1: { name: string; score: number };
  player2: { name: string; score: number };
  currentRound: number;
}

interface SharedCardData {
  theme: string;
  size: CardSize;
  language: Language;
  cards: string[];
}

const HorrorBingo = () => {
  const [language, setLanguage] = useState<Language>('ro');
  const [selectedTheme, setSelectedTheme] = useState('slasher');
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['slasher']); // New: multiple themes
  const [cardSize, setCardSize] = useState<CardSize>(5);
  const [bingoCard, setBingoCard] = useState<BingoCell[]>([]);
  const [showSettings, setShowSettings] = useState(true);
  const [difficulty, setDifficulty] = useState(50);
  const [showClicheExcluder, setShowClicheExcluder] = useState(false);
  const [excludedIdeas, setExcludedIdeas] = useState<string[]>([]);
  const [showMovieSuggester, setShowMovieSuggester] = useState(false);
  const [showVSMode, setShowVSMode] = useState(false);
  const [vsGameState, setVSGameState] = useState<VSGameState | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isSharedCard, setIsSharedCard] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const { toast } = useToast();

  const translations = {
    ro: {
      title: "Horror Bingo",
      subtitle: "Jocul perfect pentru seara de filme horror!",
      language: "Limbă",
      theme: "Tema filmului",
      cardSize: "Mărimea cardului",
      generateCard: "Generează Card",
      resetCard: "Resetează Card",
      downloadCard: "Descarcă Card",
      settings: "Setări",
      hideSettings: "Ascunde Setări",
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
      themes: "Teme pentru filme",
      selectMultipleThemes: "Selectează mai multe teme",
      showThemes: "Arată Teme",
      hideThemes: "Ascunde Teme",
      selectedThemes: "Teme selectate"
    },
    en: {
      title: "Horror Bingo",
      subtitle: "The perfect game for horror movie nights!",
      language: "Language",
      theme: "Movie theme",
      cardSize: "Card size",
      generateCard: "Generate Card",
      resetCard: "Reset Card",
      downloadCard: "Download Card",
      settings: "Settings",
      hideSettings: "Hide Settings",
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
      themes: "Movie themes",
      selectMultipleThemes: "Select multiple themes",
      showThemes: "Show Themes",
      hideThemes: "Hide Themes",
      selectedThemes: "Selected themes"
    }
  };

  const t = translations[language];

  // Load shared card from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardData = urlParams.get('d') || urlParams.get('card'); // Support both old and new format
    
    if (cardData) {
      try {
        const decodedData = decodeURIComponent(cardData);
        const parsedData = JSON.parse(decodedData);
        
        // Handle both old and new format
        const theme = parsedData.t || parsedData.theme;
        const size = parsedData.s || parsedData.size;
        const lang = parsedData.l || parsedData.language;
        const cards = parsedData.c || parsedData.cards;
        
        // Set the shared card data
        setLanguage(lang);
        setSelectedTheme(theme);
        setCardSize(size);
        setIsSharedCard(true);
        
        // Create bingo cells from shared card data
        const sharedCells: BingoCell[] = cards.map((cardText: string) => ({
          idea: {
            ro: lang === 'ro' ? cardText : cardText,
            en: lang === 'en' ? cardText : cardText
          },
          isChecked: false,
          isEditing: false,
          editedText: cardText
        }));
        
        setBingoCard(sharedCells);
        setShowSettings(false);
        
        toast({
          title: t.sharedCard,
          description: `Card ${size}x${size} încărcat cu succes!`,
        });
      } catch (error) {
        console.error('Error loading shared card:', error);
        toast({
          title: "Eroare",
          description: "Nu s-a putut încărca cardul partajat.",
          variant: "destructive"
        });
        generateBingoCard();
      }
    } else {
      generateBingoCard();
    }
  }, []);

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => {
      if (prev.includes(theme)) {
        // Don't allow removing the last theme
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== theme);
      } else {
        return [...prev, theme];
      }
    });
    
    // Update single theme for backward compatibility
    if (!selectedThemes.includes(theme)) {
      setSelectedTheme(theme);
    }
  };

  const generateBingoCard = () => {
    // Collect ideas from all selected themes
    let allIdeas: BingoIdea[] = [];
    
    selectedThemes.forEach(themeKey => {
      const theme = bingoThemes[themeKey];
      if (theme) {
        allIdeas = [...allIdeas, ...theme.ideas];
      }
    });
    
    // Remove duplicates based on the text in current language
    const uniqueIdeas = allIdeas.filter((idea, index, arr) => 
      arr.findIndex(item => item[language] === idea[language]) === index
    );
    
    // Filter out excluded ideas
    let ideas = uniqueIdeas.filter(idea => !excludedIdeas.includes(idea[language]));
    
    // Apply difficulty filter
    if (difficulty < 30) {
      ideas = ideas.slice(0, Math.ceil(ideas.length * 0.6));
    } else if (difficulty > 70) {
      ideas = ideas.slice(Math.floor(ideas.length * 0.4));
    }
    
    const cardCells = cardSize * cardSize;
    const selectedIdeas: BingoIdea[] = [];

    // Shuffle and select ideas
    for (let i = 0; i < cardCells && ideas.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * ideas.length);
      selectedIdeas.push(ideas[randomIndex]);
      ideas.splice(randomIndex, 1);
    }

    // Fill remaining cells if needed
    while (selectedIdeas.length < cardCells) {
      selectedIdeas.push({
        ro: "Spațiu liber",
        en: "Free space"
      });
    }

    setBingoCard(selectedIdeas.map(idea => ({
      idea,
      isChecked: false,
      isEditing: false,
      editedText: idea[language]
    })));
    
    setIsSharedCard(false);
    
    // Clear URL parameters when generating new card
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const toggleCell = (index: number) => {
    setBingoCard(prev => prev.map((cell, i) => 
      i === index ? { ...cell, isChecked: !cell.isChecked } : cell
    ));
  };

  const startEditing = (index: number) => {
    setBingoCard(prev => prev.map((cell, i) => 
      i === index ? { ...cell, isEditing: true, editedText: cell.idea[language] } : cell
    ));
  };

  const saveEdit = (index: number) => {
    setBingoCard(prev => prev.map((cell, i) => 
      i === index ? {
        ...cell,
        isEditing: false,
        idea: {
          ...cell.idea,
          [language]: cell.editedText
        }
      } : cell
    ));
  };

  const cancelEdit = (index: number) => {
    setBingoCard(prev => prev.map((cell, i) => 
      i === index ? { ...cell, isEditing: false, editedText: cell.idea[language] } : cell
    ));
  };

  const updateEditText = (index: number, text: string) => {
    setBingoCard(prev => prev.map((cell, i) => 
      i === index ? { ...cell, editedText: text } : cell
    ));
  };

  const resetCard = () => {
    setBingoCard(prev => prev.map(cell => ({ ...cell, isChecked: false })));
  };

  const handleDownload = () => {
    downloadBingoCard(cardSize, language);
  };

  const toggleExcludedIdea = (ideaText: string) => {
    setExcludedIdeas(prev => 
      prev.includes(ideaText) 
        ? prev.filter(idea => idea !== ideaText)
        : [...prev, ideaText]
    );
  };

  const handleMovieSuggestion = (platforms: string[]) => {
    const movie = suggestRandomMovie(selectedThemes, platforms);
    if (movie) {
      toast({
        title: t.suggestedMovie,
        description: `${movie.title} (${movie.year}) - ${movie.platforms.join(', ')}`,
      });
      generateBingoCard();
    } else {
      toast({
        title: "Nu s-a găsit film",
        description: "Încearcă să selectezi mai multe platforme sau o altă temă.",
        variant: "destructive"
      });
    }
  };

  const startVSGame = (player1Name: string, player2Name: string) => {
    setVSGameState({
      isActive: true,
      player1: { name: player1Name, score: 0 },
      player2: { name: player2Name, score: 0 },
      currentRound: 1
    });
    generateBingoCard();
  };

  const handleBingo = (playerNumber: 1 | 2) => {
    if (!vsGameState) return;
    
    const updatedState = {
      ...vsGameState,
      player1: {
        ...vsGameState.player1,
        score: playerNumber === 1 ? vsGameState.player1.score + 1 : vsGameState.player1.score
      },
      player2: {
        ...vsGameState.player2,
        score: playerNumber === 2 ? vsGameState.player2.score + 1 : vsGameState.player2.score
      },
      currentRound: vsGameState.currentRound + 1
    };
    
    setVSGameState(updatedState);
    
    const winnerName = playerNumber === 1 ? updatedState.player1.name : updatedState.player2.name;
    toast({
      title: `${t.winner}: ${winnerName}!`,
      description: `Runda ${vsGameState.currentRound} câștigată!`,
    });
    
    // Generate new card for next round
    setTimeout(() => {
      generateBingoCard();
      resetCard();
    }, 2000);
  };

  useEffect(() => {
    if (bingoCard.length > 0 && !isSharedCard) {
      generateBingoCard();
    }
  }, [language, selectedThemes, cardSize, difficulty, excludedIdeas]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-4">
      <StardustLogo />
      <div className="max-w-6xl mx-auto pt-8 px-2 sm:px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="w-8 h-8 sm:w-12 sm:h-12 text-red-500" />
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <Skull className="w-8 h-8 sm:w-12 sm:h-12 text-red-500" />
          </div>
          <p className="text-lg sm:text-xl text-gray-300 mb-4">{t.subtitle}</p>
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
          
          <div className="flex gap-2 justify-center flex-wrap mb-6">
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-xs sm:text-sm"
            >
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              {showSettings ? t.hideSettings : t.settings}
            </Button>
            
            <Button
              onClick={() => setShowClicheExcluder(!showClicheExcluder)}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white text-xs sm:text-sm"
            >
              <Filter className="w-4 h-4 mr-1 sm:mr-2" />
              {t.excludeCliches}
            </Button>
            
            <Button
              onClick={() => setShowMovieSuggester(!showMovieSuggester)}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-xs sm:text-sm"
            >
              <Film className="w-4 h-4 mr-1 sm:mr-2" />
              {t.movieSuggester}
            </Button>
            
            <Button
              onClick={() => setShowVSMode(!showVSMode)}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white text-xs sm:text-sm"
            >
              <Users className="w-4 h-4 mr-1 sm:mr-2" />
              {t.vsMode}
            </Button>

            {bingoCard.length > 0 && (
              <Button
                onClick={() => setShowQRCode(!showQRCode)}
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white text-xs sm:text-sm"
              >
                <QrCode className="w-4 h-4 mr-1 sm:mr-2" />
                {t.qrCode}
              </Button>
            )}
          </div>
        </div>

        {/* Feature Panels */}
        <div className="grid gap-6 mb-8">
          {showClicheExcluder && (
            <ClicheExcluder
              allIdeas={selectedThemes.flatMap(themeKey => bingoThemes[themeKey]?.ideas || [])}
              excludedIdeas={excludedIdeas}
              onToggleExclude={toggleExcludedIdea}
              onClose={() => setShowClicheExcluder(false)}
              language={language}
            />
          )}
          
          {showMovieSuggester && (
            <MovieSuggester
              selectedThemes={selectedThemes}
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
              selectedTheme={selectedTheme}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t.language}
                  </label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white hover:border-red-500/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="ro">Română</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t.cardSize}
                  </label>
                  <Select value={cardSize.toString()} onValueChange={(value) => setCardSize(parseInt(value) as CardSize)}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white hover:border-red-500/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="3">3x3</SelectItem>
                      <SelectItem value="4">4x4</SelectItem>
                      <SelectItem value="5">5x5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Theme Selection with Dropdown */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    {t.themes}
                  </label>
                  <Button
                    onClick={() => setShowThemeSelector(!showThemeSelector)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-400 hover:bg-gray-700"
                  >
                    {showThemeSelector ? t.hideThemes : t.showThemes}
                  </Button>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-400">
                    {t.selectedThemes}: {selectedThemes.map(theme => bingoThemes[theme]?.name[language]).join(', ')}
                  </p>
                </div>

                {showThemeSelector && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    {Object.entries(bingoThemes).map(([key, theme]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={selectedThemes.includes(key)}
                          onCheckedChange={() => toggleTheme(key)}
                          className="border-gray-600"
                        />
                        <label
                          htmlFor={key}
                          className="text-sm text-gray-200 cursor-pointer"
                        >
                          {theme.name[language]}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <DifficultySlider
                  difficulty={difficulty}
                  onDifficultyChange={setDifficulty}
                  language={language}
                />
              </div>

              <div className="flex gap-2 sm:gap-4 mt-6 flex-wrap">
                <Button 
                  onClick={generateBingoCard}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30 text-xs sm:text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                  {t.generateCard}
                </Button>
                <Button 
                  onClick={resetCard}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-xs sm:text-sm"
                >
                  {t.resetCard}
                </Button>
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4 mr-1 sm:mr-2" />
                  {t.downloadCard}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bingo Card */}
        {bingoCard.length > 0 && (
          <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm shadow-2xl shadow-red-900/30">
            <CardContent className="p-3 sm:p-6">
              <div 
                id="bingo-card"
                className={`grid gap-2 sm:gap-3 mx-auto`}
                style={{ 
                  gridTemplateColumns: `repeat(${cardSize}, 1fr)`,
                  aspectRatio: '1',
                  maxWidth: '100%'
                }}
              >
                {bingoCard.map((cell, index) => (
                  <div
                    key={index}
                    className={`
                      relative group border-2 rounded-lg p-2 sm:p-3 cursor-pointer transition-all duration-300
                      ${cell.isChecked 
                        ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-400 shadow-lg shadow-red-500/30 transform scale-105' 
                        : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-600/50 hover:border-red-500/60 hover:bg-gradient-to-br hover:from-gray-700/80 hover:to-gray-800/80 hover:shadow-lg hover:shadow-red-900/20'
                      }
                      min-h-[60px] sm:min-h-[80px] flex flex-col items-center justify-center text-center
                      backdrop-blur-sm
                    `}
                    onClick={() => !cell.isEditing && toggleCell(index)}
                  >
                    {cell.isEditing ? (
                      <div className="w-full space-y-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={cell.editedText}
                          onChange={(e) => updateEditText(index, e.target.value)}
                          className="text-xs bg-gray-900/80 border-gray-600 text-white"
                          autoFocus
                        />
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            onClick={() => saveEdit(index)}
                            className="bg-green-600 hover:bg-green-700 h-6 px-2"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelEdit(index)}
                            className="border-gray-600 text-gray-400 hover:bg-gray-700 h-6 px-2"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className={`text-xs sm:text-sm font-medium leading-tight ${cell.isChecked ? 'text-white' : 'text-gray-200'}`}>
                          {cell.idea[language]}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(index);
                          }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-white"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        {cell.isChecked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/20 flex items-center justify-center animate-pulse">
                              <span className="text-lg sm:text-2xl">💀</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
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
