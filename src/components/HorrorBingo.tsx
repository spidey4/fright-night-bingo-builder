
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skull, RefreshCw, Edit3, Save, X, Settings } from 'lucide-react';
import { bingoThemes, BingoIdea } from '@/data/bingoData';

type Language = 'ro' | 'en';
type CardSize = 3 | 4 | 5;

interface BingoCell {
  idea: BingoIdea;
  isChecked: boolean;
  isEditing: boolean;
  editedText: string;
}

const HorrorBingo = () => {
  const [language, setLanguage] = useState<Language>('ro');
  const [selectedTheme, setSelectedTheme] = useState('slasher');
  const [cardSize, setCardSize] = useState<CardSize>(5);
  const [bingoCard, setBingoCard] = useState<BingoCell[]>([]);
  const [showSettings, setShowSettings] = useState(true);

  const translations = {
    ro: {
      title: "Horror Bingo",
      subtitle: "Jocul perfect pentru seara de filme horror!",
      language: "Limbă",
      theme: "Tema filmului",
      cardSize: "Mărimea cardului",
      generateCard: "Generează Card",
      resetCard: "Resetează Card",
      settings: "Setări",
      hideSettings: "Ascunde Setări",
      editCell: "Editează",
      saveCell: "Salvează",
      cancelEdit: "Anulează"
    },
    en: {
      title: "Horror Bingo",
      subtitle: "The perfect game for horror movie nights!",
      language: "Language",
      theme: "Movie theme",
      cardSize: "Card size",
      generateCard: "Generate Card",
      resetCard: "Reset Card",
      settings: "Settings",
      hideSettings: "Hide Settings",
      editCell: "Edit",
      saveCell: "Save",
      cancelEdit: "Cancel"
    }
  };

  const t = translations[language];

  const generateBingoCard = () => {
    const theme = bingoThemes[selectedTheme];
    const ideas = [...theme.ideas];
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

  useEffect(() => {
    if (bingoCard.length > 0) {
      generateBingoCard();
    }
  }, [language, selectedTheme, cardSize]);

  useEffect(() => {
    generateBingoCard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="w-12 h-12 text-red-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <Skull className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-xl text-gray-300 mb-6">{t.subtitle}</p>
          
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            className="mb-6 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showSettings ? t.hideSettings : t.settings}
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="mb-8 bg-gray-800/50 border-red-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-400">{t.settings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t.language}
                  </label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
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
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {Object.entries(bingoThemes).map(([key, theme]) => (
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
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="3">3x3</SelectItem>
                      <SelectItem value="4">4x4</SelectItem>
                      <SelectItem value="5">5x5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={generateBingoCard}
                  className="bg-red-600 hover:bg-red-700 text-white"
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bingo Card */}
        {bingoCard.length > 0 && (
          <Card className="bg-gray-800/50 border-red-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div 
                className={`grid gap-2 mx-auto max-w-4xl`}
                style={{ 
                  gridTemplateColumns: `repeat(${cardSize}, 1fr)`,
                  aspectRatio: '1'
                }}
              >
                {bingoCard.map((cell, index) => (
                  <div
                    key={index}
                    className={`
                      relative group border-2 rounded-lg p-2 cursor-pointer transition-all duration-300
                      ${cell.isChecked 
                        ? 'bg-red-600 border-red-400 shadow-lg shadow-red-500/20' 
                        : 'bg-gray-700/50 border-gray-600 hover:border-red-500/50 hover:bg-gray-700'
                      }
                      min-h-[80px] flex flex-col items-center justify-center text-center
                    `}
                    onClick={() => !cell.isEditing && toggleCell(index)}
                  >
                    {cell.isEditing ? (
                      <div className="w-full space-y-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={cell.editedText}
                          onChange={(e) => updateEditText(index, e.target.value)}
                          className="text-xs bg-gray-800 border-gray-600 text-white"
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
                        <span className="text-xs font-medium leading-tight">
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
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
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
