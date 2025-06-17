import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skull, RefreshCw, Edit3, Save, X, Settings, Download, Filter, Users, Film, Target, QrCode, Heart, HeartOff, Volume2, Palette } from 'lucide-react';
import { bingoThemes, BingoIdea } from '@/data/bingoData';
import StardustLogo from '@/components/StardustLogo';
import DifficultySlider from '@/components/DifficultySlider';
import ClicheExcluder from '@/components/ClicheExcluder';
import MovieSuggester from '@/components/MovieSuggester';
import VSMode from '@/components/VSMode';
import QRCodeShare from '@/components/QRCodeShare';
import CustomThemes from '@/components/CustomThemes';
import SoundEffects from '@/components/SoundEffects';
import FavoriteCards from '@/components/FavoriteCards';
import { downloadBingoCard } from '@/utils/downloadCard';
import { suggestRandomMovie } from '@/utils/movieSuggester';
import { soundEffects } from '@/utils/soundEffects';
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

interface CustomTheme {
  id: string;
  name: { ro: string; en: string };
  ideas: BingoIdea[];
}

interface FavoriteCard {
  id: string;
  ideas: BingoIdea[];
  timestamp: number;
  language: 'ro' | 'en';
}

const HorrorBingo = () => {
  const [language, setLanguage] = useState<Language>('ro');
  const [selectedTheme, setSelectedTheme] = useState('slasher');
  const [cardSize, setCardSize] = useState<CardSize>(5);
  const [bingoCard, setBingoCard] = useState<BingoCell[]>([]);
  const [showSettings, setShowSettings] = useState(true);
  const [difficulty, setDifficulty] = useState(50);
  const [showClicheExcluder, setShowClicheExcluder] = useState(false);
  const [excludedIdeas, setExcludedIdeas] = useState<string[]>([]);
  const [showMovieSuggester, setShowMovieSuggester] = useState(false);
  const [showVSMode, setShowVSMode] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showCustomThemes, setShowCustomThemes] = useState(false);
  const [showSoundEffects, setShowSoundEffects] = useState(false);
  const [showFavoriteCards, setShowFavoriteCards] = useState(false);
  const [vsGameState, setVSGameState] = useState<VSGameState | null>(null);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [favoriteCards, setFavoriteCards] = useState<FavoriteCard[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
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
      qrCode: "Cod QR",
      customThemes: "Teme Personalizate",
      soundEffects: "Efecte Sonore",
      favoriteCards: "Carduri Favorite",
      addToFavorites: "Adaugă la Favorite",
      removeFromFavorites: "Șterge din Favorite",
      winner: "Câștigător",
      suggestedMovie: "Film sugerat",
      cardSaved: "Card salvat la favorite!",
      cardRemoved: "Card șters din favorite!"
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
      qrCode: "QR Code",
      customThemes: "Custom Themes",
      soundEffects: "Sound Effects",
      favoriteCards: "Favorite Cards",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
      winner: "Winner",
      suggestedMovie: "Suggested movie",
      cardSaved: "Card saved to favorites!",
      cardRemoved: "Card removed from favorites!"
    }
  };

  const t = translations[language];

  // Load saved data on component mount
  useEffect(() => {
    const savedCustomThemes = localStorage.getItem('horror-bingo-custom-themes');
    if (savedCustomThemes) {
      setCustomThemes(JSON.parse(savedCustomThemes));
    }

    const savedFavorites = localStorage.getItem('horror-bingo-favorites');
    if (savedFavorites) {
      setFavoriteCards(JSON.parse(savedFavorites));
    }

    setSoundEnabled(soundEffects.isEnabled());
  }, []);

  // Save custom themes to localStorage
  useEffect(() => {
    localStorage.setItem('horror-bingo-custom-themes', JSON.stringify(customThemes));
  }, [customThemes]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('horror-bingo-favorites', JSON.stringify(favoriteCards));
  }, [favoriteCards]);

  const getAllThemes = () => {
    const allThemes = { ...bingoThemes };
    customThemes.forEach(theme => {
      allThemes[theme.id] = theme;
    });
    return allThemes;
  };

  const generateBingoCard = () => {
    const allThemes = getAllThemes();
    const theme = allThemes[selectedTheme];
    let ideas = [...theme.ideas];
    
    // Filter out excluded ideas
    ideas = ideas.filter(idea => !excludedIdeas.includes(idea[language]));
    
    // Apply difficulty filter
    if (difficulty < 30) {
      ideas = ideas.slice(0, Math.ceil(ideas.length * 0.6));
    } else if (difficulty > 70) {
      ideas = ideas.slice(Math.floor(ideas.length * 0.4));
    }
    
    // Add favorite cards with higher probability
    const favoriteIdeas: BingoIdea[] = [];
    favoriteCards.forEach(card => {
      card.ideas.forEach(idea => {
        if (Math.random() < 0.3) { // 30% chance for favorite ideas
          favoriteIdeas.push(idea);
        }
      });
    });
    
    ideas = [...ideas, ...favoriteIdeas];
    
    const cardCells = cardSize * cardSize;
    const selectedIdeas: BingoIdea[] = [];

    for (let i = 0; i < cardCells && ideas.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * ideas.length);
      selectedIdeas.push(ideas[randomIndex]);
      ideas.splice(randomIndex, 1);
    }

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
  };

  const toggleCell = (index: number) => {
    soundEffects.playClick();
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
    const movie = suggestRandomMovie(selectedTheme, platforms);
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
    
    soundEffects.playBingo();
    
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
    
    setTimeout(() => {
      generateBingoCard();
      resetCard();
    }, 2000);
  };

  const handleThemeCreated = (theme: CustomTheme) => {
    setCustomThemes(prev => [...prev, theme]);
    setSelectedTheme(theme.id);
    toast({
      title: "Temă creată!",
      description: `Tema "${theme.name[language]}" a fost adăugată.`,
    });
  };

  const handleDeleteTheme = (themeId: string) => {
    setCustomThemes(prev => prev.filter(theme => theme.id !== themeId));
    if (selectedTheme === themeId) {
      setSelectedTheme('slasher');
    }
  };

  const getCurrentCardId = () => {
    return bingoCard.map(cell => cell.idea[language]).join('|');
  };

  const isCurrentCardFavorite = () => {
    const currentCardId = getCurrentCardId();
    return favoriteCards.some(card => 
      card.ideas.map(idea => idea[language]).join('|') === currentCardId
    );
  };

  const toggleFavoriteCard = () => {
    const currentCardId = getCurrentCardId();
    const currentIdeas = bingoCard.map(cell => cell.idea);
    
    if (isCurrentCardFavorite()) {
      setFavoriteCards(prev => prev.filter(card => 
        card.ideas.map(idea => idea[language]).join('|') !== currentCardId
      ));
      toast({
        title: t.cardRemoved,
      });
    } else {
      const newFavorite: FavoriteCard = {
        id: `favorite_${Date.now()}`,
        ideas: currentIdeas,
        timestamp: Date.now(),
        language
      };
      setFavoriteCards(prev => [...prev, newFavorite]);
      soundEffects.playFavorite();
      toast({
        title: t.cardSaved,
      });
    }
  };

  const loadFavoriteCard = (card: FavoriteCard) => {
    setBingoCard(card.ideas.map(idea => ({
      idea,
      isChecked: false,
      isEditing: false,
      editedText: idea[language]
    })));
    setShowFavoriteCards(false);
  };

  const removeFavoriteCard = (cardId: string) => {
    setFavoriteCards(prev => prev.filter(card => card.id !== cardId));
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundEffects.setEnabled(enabled);
  };

  useEffect(() => {
    if (bingoCard.length > 0) {
      generateBingoCard();
    }
  }, [language, selectedTheme, cardSize, difficulty, excludedIdeas]);

  useEffect(() => {
    generateBingoCard();
  }, []);

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

            <Button
              onClick={() => setShowQRCode(!showQRCode)}
              variant="outline"
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
            >
              <QrCode className="w-4 h-4 mr-2" />
              {t.qrCode}
            </Button>

            <Button
              onClick={() => setShowCustomThemes(!showCustomThemes)}
              variant="outline"
              className="border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white"
            >
              <Palette className="w-4 h-4 mr-2" />
              {t.customThemes}
            </Button>

            <Button
              onClick={() => setShowSoundEffects(!showSoundEffects)}
              variant="outline"
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {t.soundEffects}
            </Button>

            <Button
              onClick={() => setShowFavoriteCards(!showFavoriteCards)}
              variant="outline"
              className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              {t.favoriteCards}
            </Button>
          </div>
        </div>

        {/* Feature Panels */}
        <div className="grid gap-6 mb-8">
          {showClicheExcluder && (
            <ClicheExcluder
              allIdeas={getAllThemes()[selectedTheme].ideas}
              excludedIdeas={excludedIdeas}
              onToggleExclude={toggleExcludedIdea}
              onClose={() => setShowClicheExcluder(false)}
              language={language}
            />
          )}
          
          {showMovieSuggester && (
            <MovieSuggester
              selectedTheme={selectedTheme}
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

          {showQRCode && (
            <QRCodeShare
              cardData={bingoCard}
              language={language}
              onClose={() => setShowQRCode(false)}
            />
          )}

          {showCustomThemes && (
            <CustomThemes
              language={language}
              onClose={() => setShowCustomThemes(false)}
              onThemeCreated={handleThemeCreated}
              customThemes={customThemes}
              onDeleteTheme={handleDeleteTheme}
            />
          )}

          {showSoundEffects && (
            <SoundEffects
              language={language}
              onClose={() => setShowSoundEffects(false)}
              soundEnabled={soundEnabled}
              onToggleSound={handleSoundToggle}
            />
          )}

          {showFavoriteCards && (
            <FavoriteCards
              language={language}
              onClose={() => setShowFavoriteCards(false)}
              favoriteCards={favoriteCards}
              onRemoveFavorite={removeFavoriteCard}
              onLoadCard={loadFavoriteCard}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    {t.theme}
                  </label>
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white hover:border-red-500/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {Object.entries(getAllThemes()).map(([key, theme]) => (
                        <SelectItem key={key} value={key}>
                          {theme.name[language]}
                        </SelectItem>
                      ))}
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

                <div>
                  <DifficultySlider
                    difficulty={difficulty}
                    onDifficultyChange={setDifficulty}
                    language={language}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6 flex-wrap">
                <Button 
                  onClick={generateBingoCard}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t.generateCard}
                </Button>
                <Button 
                  onClick={resetCard}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  {t.resetCard}
                </Button>
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t.downloadCard}
                </Button>
                <Button
                  onClick={toggleFavoriteCard}
                  variant="outline"
                  className={`${isCurrentCardFavorite() 
                    ? 'border-pink-500 text-pink-400 hover:bg-pink-500' 
                    : 'border-gray-500 text-gray-400 hover:bg-gray-500'
                  } hover:text-white`}
                  disabled={bingoCard.length === 0}
                >
                  {isCurrentCardFavorite() ? (
                    <HeartOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Heart className="w-4 h-4 mr-2" />
                  )}
                  {isCurrentCardFavorite() ? t.removeFromFavorites : t.addToFavorites}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bingo Card */}
        {bingoCard.length > 0 && (
          <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm shadow-2xl shadow-red-900/30">
            <CardContent className="p-6">
              <div 
                id="bingo-card"
                className={`grid gap-3 mx-auto max-w-4xl`}
                style={{ 
                  gridTemplateColumns: `repeat(${cardSize}, 1fr)`,
                  aspectRatio: '1'
                }}
              >
                {bingoCard.map((cell, index) => (
                  <div
                    key={index}
                    className={`
                      relative group border-2 rounded-lg p-3 cursor-pointer transition-all duration-300
                      ${cell.isChecked 
                        ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-400 shadow-lg shadow-red-500/30 transform scale-105' 
                        : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-600/50 hover:border-red-500/60 hover:bg-gradient-to-br hover:from-gray-700/80 hover:to-gray-800/80 hover:shadow-lg hover:shadow-red-900/20'
                      }
                      min-h-[80px] flex flex-col items-center justify-center text-center
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
                        <span className={`text-xs font-medium leading-tight ${cell.isChecked ? 'text-white' : 'text-gray-200'}`}>
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
                            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center animate-pulse">
                              <span className="text-2xl">💀</span>
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
