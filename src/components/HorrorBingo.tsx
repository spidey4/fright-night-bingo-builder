
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, Download, Users, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { bingoIdeas, BingoIdea } from '@/data/bingoIdeas';
import { downloadBingoCard } from '@/utils/cardDownloader';

type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'all';

const HorrorBingo = () => {
  const [currentCard, setCurrentCard] = useState<BingoIdea[]>([]);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [excludedIdeas, setExcludedIdeas] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showVSMode, setShowVSMode] = useState(false);
  
  const [selectedTheme, setSelectedTheme] = useState('classic');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    generateNewCard();
  }, [difficulty, excludedIdeas]);

  const generateNewCard = () => {
    let filteredData = bingoIdeas.filter(item => !excludedIdeas.includes(item.ro));

    if (difficulty !== 'all') {
      filteredData = filteredData.filter(item => item.difficulty === difficulty);
    }

    if (filteredData.length < 25) {
      toast({
        title: "Nu sunt suficiente elemente",
        description: "Selectează mai puține clisee sau alege o dificultate mai ușoară.",
        variant: "destructive",
      });
      return;
    }

    const newCard: BingoIdea[] = [];
    const usedIndices: number[] = [];

    while (newCard.length < 25 && usedIndices.length < filteredData.length) {
      const randomIndex = Math.floor(Math.random() * filteredData.length);
      if (!usedIndices.includes(randomIndex)) {
        newCard.push(filteredData[randomIndex]);
        usedIndices.push(randomIndex);
      }
    }

    if (newCard.length === 25) {
      setCurrentCard(newCard);
      setCheckedItems([]);
    } else {
      toast({
        title: "Nu s-a putut genera cardul",
        description: "Încearcă din nou sau modifică setările.",
        variant: "destructive",
      });
    }
  };

  const toggleItem = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(item => item !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  const themes = {
    classic: {
      name: 'Classic Horror',
      bgGradient: 'bg-gradient-to-br from-gray-900 via-red-900 to-black',
      cardBg: 'bg-gray-800/90',
      accent: 'text-red-400',
      border: 'border-red-600/30'
    },
    gothic: {
      name: 'Gothic',
      bgGradient: 'bg-gradient-to-br from-purple-900 via-gray-900 to-black',
      cardBg: 'bg-purple-900/20',
      accent: 'text-purple-300',
      border: 'border-purple-600/30'
    },
    slasher: {
      name: 'Slasher',
      bgGradient: 'bg-gradient-to-br from-red-800 via-black to-red-900',
      cardBg: 'bg-red-900/20',
      accent: 'text-red-300',
      border: 'border-red-500/30'
    },
    supernatural: {
      name: 'Supernatural',
      bgGradient: 'bg-gradient-to-br from-blue-900 via-gray-900 to-black',
      cardBg: 'bg-blue-900/20',
      accent: 'text-blue-300',
      border: 'border-blue-600/30'
    },
    zombie: {
      name: 'Zombie Apocalypse',
      bgGradient: 'bg-gradient-to-br from-green-900 via-gray-800 to-black',
      cardBg: 'bg-green-900/20',
      accent: 'text-green-300',
      border: 'border-green-600/30'
    }
  };

  const currentTheme = themes[selectedTheme as keyof typeof themes];

  return (
    <div className={`min-h-screen ${currentTheme.bgGradient} text-white p-4 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${currentTheme.accent} drop-shadow-2xl`}>
            Horror Bingo
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Bifează elementele pe măsură ce le vezi în film!
          </p>
          
          {/* Theme Selector */}
          <div className="mb-6 flex justify-center">
            <Card className={`${currentTheme.cardBg} ${currentTheme.border} border backdrop-blur-sm`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-300">Temă:</label>
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {Object.entries(themes).map(([key, theme]) => (
                        <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowThemeSelector(!showThemeSelector)}
                    className="text-gray-400 hover:text-white"
                  >
                    {showThemeSelector ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button 
            onClick={generateNewCard} 
            className={`${currentTheme.cardBg} ${currentTheme.border} border hover:bg-gray-700/80 text-white backdrop-blur-sm`}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Card Nou
          </Button>
          
          <Button 
            onClick={downloadBingoCard}
            className={`${currentTheme.cardBg} ${currentTheme.border} border hover:bg-gray-700/80 text-white backdrop-blur-sm`}
          >
            <Download className="w-4 h-4 mr-2" />
            Descarcă
          </Button>

          <Button 
            onClick={() => setShowVSMode(!showVSMode)}
            className={`${currentTheme.cardBg} ${currentTheme.border} border hover:bg-gray-700/80 text-white backdrop-blur-sm`}
          >
            <Users className="w-4 h-4 mr-2" />
            Mod VS
          </Button>

          <Button 
            onClick={() => setShowSettings(!showSettings)}
            className={`${currentTheme.cardBg} ${currentTheme.border} border hover:bg-gray-700/80 text-white backdrop-blur-sm`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Setări
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className={`${currentTheme.cardBg} ${currentTheme.border} border backdrop-blur-sm mb-8`}>
            <CardHeader>
              <CardTitle className={currentTheme.accent}>Setări</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-300 block">Dificultate:</label>
                <Select value={difficulty} onValueChange={(value: DifficultyLevel) => setDifficulty(value)}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="easy" className="text-white hover:bg-gray-700">Ușor</SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-gray-700">Mediu</SelectItem>
                    <SelectItem value="hard" className="text-white hover:bg-gray-700">Greu</SelectItem>
                    <SelectItem value="all" className="text-white hover:bg-gray-700">Toate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bingo Card */}
        <Card className={`${currentTheme.cardBg} ${currentTheme.border} border backdrop-blur-sm mb-8`}>
          <CardContent className="p-6">
            <div className="grid grid-cols-5 gap-2 md:gap-4 max-w-4xl mx-auto" id="bingo-card">
              {currentCard.map((item, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square p-2 md:p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 
                    flex flex-col items-center justify-center text-center relative overflow-hidden group
                    ${checkedItems.includes(index) 
                      ? `bg-gradient-to-br from-red-600 to-red-800 border-red-400 shadow-lg shadow-red-500/30` 
                      : `${currentTheme.cardBg} ${currentTheme.border} border hover:border-red-400/50`
                    }
                  `}
                  onClick={() => toggleItem(index)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <span className={`text-xs md:text-sm font-medium z-10 ${
                    checkedItems.includes(index) ? 'text-white' : 'text-gray-200'
                  }`}>
                    {item.ro}
                  </span>
                  
                  {item.difficulty && (
                    <Badge 
                      variant="secondary" 
                      className={`mt-1 md:mt-2 text-xs z-10 ${
                        checkedItems.includes(index) 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-700/80 text-gray-300'
                      }`}
                    >
                      {item.difficulty === 'easy' ? 'Ușor' : item.difficulty === 'medium' ? 'Mediu' : 'Greu'}
                    </Badge>
                  )}

                  {checkedItems.includes(index) && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <Checkbox checked={true} className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {checkedItems.length >= 5 && (
              <div className="text-center mt-6">
                <div className={`text-2xl md:text-4xl font-bold ${currentTheme.accent} animate-pulse mb-4`}>
                  🎉 BINGO! 🎉
                </div>
                <p className="text-gray-300">Felicitări! Ai completat cardul!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HorrorBingo;
