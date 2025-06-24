import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { bingoThemes, BingoIdea } from '@/data/bingoData';
import StardustLogo from '@/components/StardustLogo';
import ClicheExcluder from '@/components/ClicheExcluder';
import MovieSuggester from '@/components/MovieSuggester';
import VSMode from '@/components/VSMode';
import QRCodeShare from '@/components/QRCodeShare';
import IdeaImporter from '@/components/IdeaImporter';
import BingoHeader from '@/components/bingo/BingoHeader';
import BingoSettingsPanel from '@/components/bingo/BingoSettingsPanel';
import BingoCard from '@/components/bingo/BingoCard';
import { downloadBingoCard } from '@/utils/downloadCard';
import { suggestRandomMovie } from '@/utils/movieSuggester';
import { useToast } from '@/hooks/use-toast';
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
  const [showIdeaImporter, setShowIdeaImporter] = useState(false);
  const [importedIdeas, setImportedIdeas] = useState<string[]>([]);
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
          title: "Card Partajat",
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
    // card generation logic
    let allIdeas: BingoIdea[] = [];
    
    // If we have imported ideas, use those instead
    if (importedIdeas.length > 0) {
      allIdeas = importedIdeas.map(idea => ({
        ro: idea,
        en: idea
      }));
    } else {
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
      const optionalThemes = {
        cursedDoll: {
          ideas: [
            { ro: 'Păpușa se mișcă singură', en: 'Doll moves by itself' },
            { ro: 'Ochii păpușii te urmăresc', en: 'Doll eyes follow you' },
            { ro: 'Păpușa vorbește în timpul nopții', en: 'Doll talks at night' }
          ]
        },
        jumpscare: {
          ideas: [
            { ro: 'Oglinda se sparge brusc', en: 'Mirror suddenly breaks' },
            { ro: 'Mâna iese din întuneric', en: 'Hand emerges from darkness' },
            { ro: 'Șoaptă din spatele personajului', en: 'Whisper behind character' },
            { ro: 'Ceva cade din dulap', en: 'Something falls from closet' }
          ]
        },
        gothic: {
          ideas: [
            { ro: 'Casă victoriana în paragină', en: 'Decaying Victorian house' },
            { ro: 'Portrete care te privesc', en: 'Portraits that watch you' },
            { ro: 'Cimitir în ceață', en: 'Foggy cemetery' },
            { ro: 'Pasaje secrete în ziduri', en: 'Secret passages in walls' },
            { ro: 'Muzică de pian fantomatică', en: 'Ghostly piano music' }
          ]
        },
        cult: {
          ideas: [
            { ro: 'Ritual în pădure', en: 'Forest ritual' },
            { ro: 'Simboluri ciudate pe ziduri', en: 'Strange symbols on walls' },
            { ro: 'Cântece în limbi străine', en: 'Chanting in foreign tongues' },
            { ro: 'Sacrificiu animal', en: 'Animal sacrifice' }
          ]
        },
        zombie: {
          ideas: [
            { ro: 'Hoardă de zombi', en: 'Zombie horde' },
            { ro: 'Refugiu improvizat', en: 'Makeshift shelter' },
            { ro: 'Hrană pe terminate', en: 'Running out of food' },
            { ro: 'Unul dintre grup e infectat', en: 'One of the group is infected' },
            { ro: 'Radio cu mesaje de urgență', en: 'Radio with emergency broadcasts' }
          ]
        }
      };
      
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
    }
    
    // Remove duplicates
    const uniqueIdeas = allIdeas.filter((idea, index, self) => 
      index === self.findIndex(i => i[language] === idea[language])
    );
    
    // Filter out excluded ideas
    let filteredIdeas = uniqueIdeas.filter(idea => !excludedIdeas.includes(idea[language]));
    
    // Improve difficulty logic
    const sortedIdeas = [...filteredIdeas].sort((a, b) => {
      const aText = a[language].toLowerCase();
      const bText = b[language].toLowerCase();
      
      const aComplexity = aText.length + (aText.includes('specific') ? 10 : 0) + (aText.includes('exact') ? 10 : 0);
      const bComplexity = bText.length + (bText.includes('specific') ? 10 : 0) + (bText.includes('exact') ? 10 : 0);
      
      return aComplexity - bComplexity;
    });
    
    // Apply difficulty filter
    let selectedPool: BingoIdea[] = [];
    if (difficulty <= 25) {
      selectedPool = sortedIdeas.slice(0, Math.ceil(sortedIdeas.length * 0.4));
    } else if (difficulty <= 50) {
      selectedPool = sortedIdeas.slice(0, Math.ceil(sortedIdeas.length * 0.7));
    } else if (difficulty <= 75) {
      selectedPool = sortedIdeas.slice(Math.floor(sortedIdeas.length * 0.3));
    } else {
      selectedPool = sortedIdeas.slice(Math.floor(sortedIdeas.length * 0.6));
    }
    
    const cardCells = cardSize * cardSize;
    const selectedIdeas: BingoIdea[] = [];

    const shuffledPool = [...selectedPool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < cardCells && i < shuffledPool.length; i++) {
      selectedIdeas.push(shuffledPool[i]);
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
    
    setIsSharedCard(false);
    
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // all handler functions

  const toggleTheme = (themeKey: string) => {
    setSelectedThemes(prev => 
      prev.includes(themeKey) 
        ? prev.filter(t => t !== themeKey)
        : [...prev, themeKey]
    );
  };

  const handleOptionalThemeChange = (themeName: string, checked: boolean) => {
    switch (themeName) {
      case 'cursedDoll':
        setIncludeCursedDoll(checked);
        break;
      case 'jumpscare':
        setIncludeJumpscare(checked);
        break;
      case 'gothic':
        setIncludeGothic(checked);
        break;
      case 'cult':
        setIncludeCult(checked);
        break;
      case 'zombie':
        setIncludeZombie(checked);
        break;
    }
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

  const handleImportIdeas = (ideas: string[]) => {
    setImportedIdeas(ideas);
    setShowIdeaImporter(false);
    
    setTimeout(() => {
      generateBingoCard();
    }, 100);
  };

  const clearImportedIdeas = () => {
    setImportedIdeas([]);
    generateBingoCard();
    toast({
      title: "Idei șterse",
      description: "S-a revenit la temele standard.",
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
        title: "Film sugerat",
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
      title: `Câștigător: ${winnerName}!`,
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
  }, [language, selectedThemes, cardSize, difficulty, excludedIdeas, includeCursedDoll, includeJumpscare, includeGothic, includeCult, includeZombie, importedIdeas]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-4">
      <StardustLogo />
      <div className="max-w-6xl mx-auto pt-8">
        <BingoHeader
          language={language}
          isSharedCard={isSharedCard}
          importedIdeas={importedIdeas}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
          onToggleIdeaImporter={() => setShowIdeaImporter(!showIdeaImporter)}
          onToggleClicheExcluder={() => setShowClicheExcluder(!showClicheExcluder)}
          onToggleMovieSuggester={() => setShowMovieSuggester(!showMovieSuggester)}
          onToggleVSMode={() => setShowVSMode(!showVSMode)}
          onToggleQRCode={() => setShowQRCode(!showQRCode)}
          onCreateNew={generateBingoCard}
          onClearImportedIdeas={clearImportedIdeas}
          hasBingoCard={bingoCard.length > 0}
        />

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
              selectedTheme={selectedThemes[0] || 'slasher'}
              cardSize={cardSize}
              onClose={() => setShowQRCode(false)}
            />
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <BingoSettingsPanel
            language={language}
            selectedThemes={selectedThemes}
            cardSize={cardSize}
            difficulty={difficulty}
            showThemeSelector={showThemeSelector}
            importedIdeas={importedIdeas}
            onLanguageChange={setLanguage}
            onCardSizeChange={setCardSize}
            onDifficultyChange={setDifficulty}
            onToggleThemeSelector={() => setShowThemeSelector(!showThemeSelector)}
            onToggleTheme={toggleTheme}
            onGenerateCard={generateBingoCard}
            onResetCard={resetCard}
            onDownloadCard={handleDownload}
            includeCursedDoll={includeCursedDoll}
            includeJumpscare={includeJumpscare}
            includeGothic={includeGothic}
            includeCult={includeCult}
            includeZombie={includeZombie}
            onOptionalThemeChange={handleOptionalThemeChange}
            customThemes={customThemes}
            onDeleteCustomTheme={deleteCustomTheme}
            showCustomThemeCreator={showCustomThemeCreator}
            onToggleCustomThemeCreator={() => setShowCustomThemeCreator(!showCustomThemeCreator)}
            newThemeName={newThemeName}
            onNewThemeNameChange={setNewThemeName}
            newThemeIdeas={newThemeIdeas}
            onNewThemeIdeasChange={setNewThemeIdeas}
            onSaveCustomTheme={saveCustomTheme}
          />
        )}

        <BingoCard
          bingoCard={bingoCard}
          cardSize={cardSize}
          language={language}
          onToggleCell={toggleCell}
          onStartEditing={startEditing}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onUpdateEditText={updateEditText}
        />

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
