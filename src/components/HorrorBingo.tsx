import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skull, RefreshCw, Edit3, Save, X, Settings, Download, Filter, Users, Film, QrCode, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';

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

const HorrorBingo = () => {
  const [language, setLanguage] = useState<Language>('ro');
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['slasher']);
  const [cardSize, setCardSize] = useState<CardSize>(5);
  const [bingoCard, setBingoCard] = useState<BingoCell[]>([]);
  const [showSettings, setShowSettings] = useState(true);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [difficulty, setDifficulty] = useState(50);
  const [showClicheExcluder, setShowClicheExcluder] = useState(false);
  const [excludedIdeas, setExcludedIdeas] = useState<string[]>([]);
  const [showMovieSuggester, setShowMovieSuggester] = useState(false);
  const [showVSMode, setShowVSMode] = useState(false);
  const [vsGameState, setVSGameState] = useState<VSGameState | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isSharedCard, setIsSharedCard] = useState(false);
  const [includeCursedDoll, setIncludeCursedDoll] = useState(false);
  const [includeJumpscare, setIncludeJumpscare] = useState(false);
  const [includeGothic, setIncludeGothic] = useState(false);
  const [includeCult, setIncludeCult] = useState(false);
  const [includeZombie, setIncludeZombie] = useState(false);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [showCustomThemeCreator, setShowCustomThemeCreator] = useState(false);
  const [newThemeName, setNewThemeName] = useState({ ro: '', en: '' });
  const [newThemeIdeas, setNewThemeIdeas] = useState<{ ro: string; en: string }[]>([{ ro: '', en: '' }]);
  const { toast } = useToast();

  // Additional optional themes
  const optionalThemes = {
    cursedDoll: {
      name: { ro: 'Păpuși Blestemate', en: 'Cursed Dolls' },
      ideas: [
        { ro: 'Păpușa se mișcă singură', en: 'Doll moves by itself' },
        { ro: 'Ochii păpușii te urmăresc', en: 'Doll eyes follow you' },
        { ro: 'Păpușa vorbește în timpul nopții', en: 'Doll talks at night' }
      ]
    },
    jumpscare: {
      name: { ro: 'Jump Scare Clasic', en: 'Classic Jump Scare' },
      ideas: [
        { ro: 'Oglinda se sparge brusc', en: 'Mirror suddenly breaks' },
        { ro: 'Mâna iese din întuneric', en: 'Hand emerges from darkness' },
        { ro: 'Șoaptă din spatele personajului', en: 'Whisper behind character' },
        { ro: 'Ceva cade din dulap', en: 'Something falls from closet' }
      ]
    },
    gothic: {
      name: { ro: 'Horror Gotic', en: 'Gothic Horror' },
      ideas: [
        { ro: 'Casă victoriana în paragină', en: 'Decaying Victorian house' },
        { ro: 'Portrete care te privesc', en: 'Portraits that watch you' },
        { ro: 'Cimitir în ceață', en: 'Foggy cemetery' },
        { ro: 'Pasaje secrete în ziduri', en: 'Secret passages in walls' },
        { ro: 'Muzică de pian fantomatică', en: 'Ghostly piano music' }
      ]
    },
    cult: {
      name: { ro: 'Culte și Ritualuri', en: 'Cults & Rituals' },
      ideas: [
        { ro: 'Ritual în pădure', en: 'Forest ritual' },
        { ro: 'Simboluri ciudate pe ziduri', en: 'Strange symbols on walls' },
        { ro: 'Cântece în limbi străine', en: 'Chanting in foreign tongues' },
        { ro: 'Sacrificiu animal', en: 'Animal sacrifice' }
      ]
    },
    zombie: {
      name: { ro: 'Apocalipsa Zombie', en: 'Zombie Apocalypse' },
      ideas: [
        { ro: 'Hoardă de zombi', en: 'Zombie horde' },
        { ro: 'Refugiu improvizat', en: 'Makeshift shelter' },
        { ro: 'Hrană pe terminate', en: 'Running out of food' },
        { ro: 'Unul dintre grup e infectat', en: 'One of the group is infected' },
        { ro: 'Radio cu mesaje de urgență', en: 'Radio with emergency broadcasts' }
      ]
    }
  };

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
      cancelTheme: "Anulează"
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
      cancelTheme: "Cancel"
    }
  };

  const t = translations[language];

  // Load shared card from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardData = urlParams.get('d') || urlParams.get('card');
    
    if (cardData) {
      try {
        const decodedData = decodeURIComponent(cardData);
        const parsedData = JSON.parse(decodedData);
        
        const themes = parsedData.t || parsedData.themes || [parsedData.theme || 'slasher'];
        const size = parsedData.s || parsedData.size;
        const lang = parsedData.l || parsedData.language;
        const cards = parsedData.c || parsedData.cards;
        
        setLanguage(lang);
        setSelectedThemes(Array.isArray(themes) ? themes : [themes]);
        setCardSize(size);
        setIsSharedCard(true);
        
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

  const generateBingoCard = () => {
    let allIdeas: BingoIdea[] = [];
    
    // Collect ideas from selected main themes
    selectedThemes.forEach(themeKey => {
      const theme = bingoThemes[themeKey];
      if (theme) {
        allIdeas = [...allIdeas, ...theme.ideas];
      }
    });

    // Collect ideas from custom themes
    customThemes.forEach(customTheme => {
      if (selectedThemes.includes(customTheme.id)) {
        allIdeas = [...allIdeas, ...customTheme.ideas];
      }
    });
    
    // Add optional theme ideas if selected (3-6 ideas each)
    if (includeCursedDoll && optionalThemes.cursedDoll) {
      const dollIdeas = optionalThemes.cursedDoll.ideas.slice(0, 3);
      allIdeas = [...allIdeas, ...dollIdeas];
    }
    
    if (includeJumpscare && optionalThemes.jumpscare) {
      const jumpscareIdeas = optionalThemes.jumpscare.ideas.slice(0, 4);
      allIdeas = [...allIdeas, ...jumpscareIdeas];
    }
    
    if (includeGothic && optionalThemes.gothic) {
      const gothicIdeas = optionalThemes.gothic.ideas.slice(0, 5);
      allIdeas = [...allIdeas, ...gothicIdeas];
    }
    
    if (includeCult && optionalThemes.cult) {
      const cultIdeas = optionalThemes.cult.ideas.slice(0, 4);
      allIdeas = [...allIdeas, ...cultIdeas];
    }
    
    if (includeZombie && optionalThemes.zombie) {
      const zombieIdeas = optionalThemes.zombie.ideas.slice(0, 5);
      allIdeas = [...allIdeas, ...zombieIdeas];
    }
    
    // Remove duplicates
    const uniqueIdeas = allIdeas.filter((idea, index, self) => 
      index === self.findIndex(i => i[language] === idea[language])
    );
    
    // Filter out excluded ideas
    let filteredIdeas = uniqueIdeas.filter(idea => !excludedIdeas.includes(idea[language]));
    
    // Improve difficulty logic - sort by complexity/rarity
    const sortedIdeas = [...filteredIdeas].sort((a, b) => {
      const aText = a[language].toLowerCase();
      const bText = b[language].toLowerCase();
      
      // Simple heuristic: longer text or specific words indicate higher difficulty
      const aComplexity = aText.length + (aText.includes('specific') ? 10 : 0) + (aText.includes('exact') ? 10 : 0);
      const bComplexity = bText.length + (bText.includes('specific') ? 10 : 0) + (bText.includes('exact') ? 10 : 0);
      
      return aComplexity - bComplexity;
    });
    
    // Apply difficulty filter with improved logic
    let selectedPool: BingoIdea[] = [];
    if (difficulty <= 25) {
      // Easy - most common clichés
      selectedPool = sortedIdeas.slice(0, Math.ceil(sortedIdeas.length * 0.4));
    } else if (difficulty <= 50) {
      // Medium - mix of common and moderate
      selectedPool = sortedIdeas.slice(0, Math.ceil(sortedIdeas.length * 0.7));
    } else if (difficulty <= 75) {
      // Hard - moderate to rare
      selectedPool = sortedIdeas.slice(Math.floor(sortedIdeas.length * 0.3));
    } else {
      // Expert - only the rarest/most specific
      selectedPool = sortedIdeas.slice(Math.floor(sortedIdeas.length * 0.6));
    }
    
    const cardCells = cardSize * cardSize;
    const selectedIdeas: BingoIdea[] = [];

    // Shuffle and select ideas
    const shuffledPool = [...selectedPool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < cardCells && i < shuffledPool.length; i++) {
      selectedIdeas.push(shuffledPool[i]);
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

  const toggleTheme = (themeKey: string) => {
    setSelectedThemes(prev => 
      prev.includes(themeKey) 
        ? prev.filter(t => t !== themeKey)
        : [...prev, themeKey]
    );
  };

  const handleOptionalThemeChange = (themeName: string, checked: CheckedState) => {
    const isChecked = checked === true;
    switch (themeName) {
      case 'cursedDoll':
        setIncludeCursedDoll(isChecked);
        break;
      case 'jumpscare':
        setIncludeJumpscare(isChecked);
        break;
      case 'gothic':
        setIncludeGothic(isChecked);
        break;
      case 'cult':
        setIncludeCult(isChecked);
        break;
      case 'zombie':
        setIncludeZombie(isChecked);
        break;
    }
  };

  const addNewIdea = () => {
    setNewThemeIdeas([...newThemeIdeas, { ro: '', en: '' }]);
  };

  const removeIdea = (index: number) => {
    setNewThemeIdeas(newThemeIdeas.filter((_, i) => i !== index));
  };

  const updateIdeaText = (index: number, lang: 'ro' | 'en', text: string) => {
    const updatedIdeas = [...newThemeIdeas];
    updatedIdeas[index][lang] = text;
    setNewThemeIdeas(updatedIdeas);
  };

  const saveCustomTheme = () => {
    if (!newThemeName.ro || !newThemeName.en) {
      toast({
        title: "Eroare",
        description: "Te rog completează numele temei în ambele limbi.",
        variant: "destructive"
      });
      return;
    }

    const validIdeas = newThemeIdeas.filter(idea => idea.ro && idea.en);
    if (validIdeas.length === 0) {
      toast({
        title: "Eroare",
        description: "Te rog adaugă cel puțin o idee validă.",
        variant: "destructive"
      });
      return;
    }

    const newTheme: CustomTheme = {
      id: `custom_${Date.now()}`,
      name: newThemeName,
      ideas: validIdeas
    };

    setCustomThemes([...customThemes, newTheme]);
    setNewThemeName({ ro: '', en: '' });
    setNewThemeIdeas([{ ro: '', en: '' }]);
    setShowCustomThemeCreator(false);

    toast({
      title: "Temă salvată!",
      description: `Tema "${newTheme.name[language]}" a fost adăugată cu succes.`,
    });
  };

  const deleteCustomTheme = (themeId: string) => {
    setCustomThemes(customThemes.filter(theme => theme.id !== themeId));
    setSelectedThemes(selectedThemes.filter(id => id !== themeId));
    
    toast({
      title: "Temă ștearsă",
      description: "Tema personalizată a fost ștearsă.",
    });
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
    const randomTheme = selectedThemes[Math.floor(Math.random() * selectedThemes.length)];
    const movie = suggestRandomMovie(randomTheme, platforms);
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
    
    setTimeout(() => {
      generateBingoCard();
      resetCard();
    }, 2000);
  };

  useEffect(() => {
    if (bingoCard.length > 0 && !isSharedCard) {
      generateBingoCard();
    }
  }, [language, selectedThemes, cardSize, difficulty, excludedIdeas, includeCursedDoll, includeJumpscare, includeGothic, includeCult, includeZombie]);

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
              selectedTheme={selectedThemes[0] || 'slasher'}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div>
                  <DifficultySlider
                    difficulty={difficulty}
                    onDifficultyChange={setDifficulty}
                    language={language}
                  />
                </div>
              </div>

              {/* Theme Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {t.themes}
                  </label>
                  <Button
                    onClick={() => setShowThemeSelector(!showThemeSelector)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    {showThemeSelector ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        {t.hideThemes}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        {t.showThemes}
                      </>
                    )}
                  </Button>
                </div>
                
                {selectedThemes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedThemes.map(themeKey => (
                      <Badge key={themeKey} variant="outline" className="border-red-500/30 text-red-400">
                        {bingoThemes[themeKey]?.name[language] || themeKey}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-400 mb-3">{t.selectMultiple}</p>

                {showThemeSelector && (
                  <div className="space-y-6">
                    {/* Main Themes */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-800/50 rounded-lg">
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

                    {/* Optional Themes */}
                    <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                      <h4 className="text-purple-300 font-medium mb-3">{t.optionalThemes}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(optionalThemes).map(([key, theme]) => {
                          const isChecked = key === 'cursedDoll' ? includeCursedDoll :
                                           key === 'jumpscare' ? includeJumpscare :
                                           key === 'gothic' ? includeGothic :
                                           key === 'cult' ? includeCult :
                                           key === 'zombie' ? includeZombie : false;
                          
                          return (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={isChecked}
                                onCheckedChange={(checked) => handleOptionalThemeChange(key, checked)}
                                className="border-purple-500"
                              />
                              <label
                                htmlFor={key}
                                className="text-sm text-purple-300 cursor-pointer"
                              >
                                {theme.name[language]} ({theme.ideas.length} idei)
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Themes */}
                    <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-blue-300 font-medium">{t.customThemes}</h4>
                        <Button
                          onClick={() => setShowCustomThemeCreator(!showCustomThemeCreator)}
                          variant="outline"
                          size="sm"
                          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {t.createCustomTheme}
                        </Button>
                      </div>

                      {/* Custom Theme Creator */}
                      {showCustomThemeCreator && (
                        <div className="mb-4 p-3 bg-blue-800/20 rounded border border-blue-600/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <Input
                              placeholder="Nume temă (română)"
                              value={newThemeName.ro}
                              onChange={(e) => setNewThemeName({...newThemeName, ro: e.target.value})}
                              className="bg-gray-800 border-blue-600"
                            />
                            <Input
                              placeholder="Theme name (English)"
                              value={newThemeName.en}
                              onChange={(e) => setNewThemeName({...newThemeName, en: e.target.value})}
                              className="bg-gray-800 border-blue-600"
                            />
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            {newThemeIdeas.map((idea, index) => (
                              <div key={index} className="flex gap-2 items-center">
                                <Input
                                  placeholder="Idee română"
                                  value={idea.ro}
                                  onChange={(e) => updateIdeaText(index, 'ro', e.target.value)}
                                  className="bg-gray-800 border-blue-600 flex-1"
                                />
                                <Input
                                  placeholder="English idea"
                                  value={idea.en}
                                  onChange={(e) => updateIdeaText(index, 'en', e.target.value)}
                                  className="bg-gray-800 border-blue-600 flex-1"
                                />
                                {newThemeIdeas.length > 1 && (
                                  <Button
                                    onClick={() => removeIdea(index)}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={addNewIdea}
                              variant="outline"
                              size="sm"
                              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              {t.addIdea}
                            </Button>
                            <Button
                              onClick={saveCustomTheme}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {t.saveTheme}
                            </Button>
                            <Button
                              onClick={() => {
                                setShowCustomThemeCreator(false);
                                setNewThemeName({ ro: '', en: '' });
                                setNewThemeIdeas([{ ro: '', en: '' }]);
                              }}
                              variant="outline"
                              size="sm"
                              className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
                            >
                              {t.cancelTheme}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Existing Custom Themes */}
                      {customThemes.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {customThemes.map((theme) => (
                            <div key={theme.id} className="flex items-center justify-between space-x-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={theme.id}
                                  checked={selectedThemes.includes(theme.id)}
                                  onCheckedChange={() => toggleTheme(theme.id)}
                                  className="border-blue-500"
                                />
                                <label
                                  htmlFor={theme.id}
                                  className="text-sm text-blue-300 cursor-pointer"
                                >
                                  {theme.name[language]} ({theme.ideas.length} idei)
                                </label>
                              </div>
                              <Button
                                onClick={() => deleteCustomTheme(theme.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6 flex-wrap">
                <Button 
                  onClick={generateBingoCard}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30"
                  disabled={selectedThemes.length === 0}
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
