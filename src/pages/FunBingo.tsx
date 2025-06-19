
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Heart, Download, Share2 } from 'lucide-react';

type Language = 'ro' | 'en';
type CardSize = 3 | 4 | 5;

interface FunBingoIdea {
  ro: string;
  en: string;
}

interface FunBingoCell {
  idea: FunBingoIdea;
  isChecked: boolean;
}

const funBingoThemes = {
  dateNight: {
    name: { ro: "Seară romantică", en: "Date Night" },
    ideas: [
      { ro: "Împărțiți același desert", en: "Share the same dessert" },
      { ro: "Vă țineți de mână", en: "Hold hands" },
      { ro: "Faceți o poză împreună", en: "Take a photo together" },
      { ro: "Râdeți în același timp", en: "Laugh at the same time" },
      { ro: "Spuneți ceva drăguț unul despre celălalt", en: "Say something sweet about each other" },
      { ro: "Dansați împreună", en: "Dance together" },
      { ro: "Priviți apusul împreună", en: "Watch the sunset together" },
      { ro: "Își spun 'Te iubesc'", en: "Say 'I love you'" },
      { ro: "Fac planuri pentru viitor", en: "Make future plans" },
      { ro: "Își aduc aminte de prima întâlnire", en: "Remember your first date" },
      { ro: "Își oferă cadouri mici", en: "Exchange small gifts" },
      { ro: "Vorbesc despre vise", en: "Talk about dreams" },
      { ro: "Se îmbrățișează strâns", en: "Give a tight hug" },
      { ro: "Fac un selfie prostesc", en: "Take a silly selfie" },
      { ro: "Cântă împreună", en: "Sing together" }
    ]
  },
  friendsNight: {
    name: { ro: "Seară cu prietenii", en: "Friends Night" },
    ideas: [
      { ro: "Cineva spune o poveste amuzantă", en: "Someone tells a funny story" },
      { ro: "Faceți o poză de grup", en: "Take a group photo" },
      { ro: "Cineva comandă pizza", en: "Someone orders pizza" },
      { ro: "Jucați un joc împreună", en: "Play a game together" },
      { ro: "Râdeți până vă doare burta", en: "Laugh until your stomach hurts" },
      { ro: "Cineva dansează ciudat", en: "Someone dances weirdly" },
      { ro: "Faceți planuri pentru următoarea ieșire", en: "Make plans for next hangout" },
      { ro: "Cineva adoarme primul", en: "Someone falls asleep first" },
      { ro: "Vă împărțiți mâncarea", en: "Share food" },
      { ro: "Ascultați muzica preferate", en: "Play favorite music" },
      { ro: "Cineva spune o glumă proastă", en: "Someone tells a bad joke" },
      { ro: "Faceți karaoke", en: "Do karaoke" },
      { ro: "Cineva verifică telefonul des", en: "Someone checks phone often" },
      { ro: "Vorbesc despre amintiri din liceu", en: "Talk about high school memories" },
      { ro: "Comandați deserturi", en: "Order desserts" }
    ]
  },
  familyTime: {
    name: { ro: "Timp în familie", en: "Family Time" },
    ideas: [
      { ro: "Bunicii povestesc amintiri", en: "Grandparents share memories" },
      { ro: "Copiii fac gălăgie", en: "Kids make noise" },
      { ro: "Cineva uită să oprească aragazul", en: "Someone forgets to turn off the stove" },
      { ro: "Se privesc poze vechi", en: "Look at old photos" },
      { ro: "Cineva adoarme pe canapea", en: "Someone falls asleep on couch" },
      { ro: "Se joacă un joc de societate", en: "Play a board game" },
      { ro: "Mama întreabă dacă ai mâncat", en: "Mom asks if you've eaten" },
      { ro: "Tata spune o poveste de când era mic", en: "Dad tells a childhood story" },
      { ro: "Cineva se ceartă pentru telecomandă", en: "Someone fights over remote" },
      { ro: "Se gătește ceva bun", en: "Someone cooks something delicious" },
      { ro: "Copiii nu vor să se culce", en: "Kids don't want to go to bed" },
      { ro: "Se vorbește despre școală/lucru", en: "Talk about school/work" },
      { ro: "Cineva spune o glumă de tată", en: "Someone tells a dad joke" },
      { ro: "Se planifică următoarea vacanță", en: "Plan next vacation" },
      { ro: "Toată lumea se îmbrățișează", en: "Everyone hugs" }
    ]
  }
};

const FunBingo = () => {
  const [language, setLanguage] = useState<Language>('ro');
  const [selectedTheme, setSelectedTheme] = useState('dateNight');
  const [cardSize, setCardSize] = useState<CardSize>(5);
  const [bingoCard, setBingoCard] = useState<FunBingoCell[]>([]);

  const translations = {
    ro: {
      title: "Fun Bingo",
      subtitle: "Jocuri vesele pentru orice ocazie!",
      language: "Limbă",
      theme: "Tema",
      cardSize: "Mărimea cardului",
      generateCard: "Generează Card",
      resetCard: "Resetează Card",
      downloadCard: "Descarcă Card",
      madeWith: "făcut cu ❤️ pentru momente speciale"
    },
    en: {
      title: "Fun Bingo",
      subtitle: "Fun games for any occasion!",
      language: "Language",
      theme: "Theme",
      cardSize: "Card size",
      generateCard: "Generate Card",
      resetCard: "Reset Card",  
      downloadCard: "Download Card",
      madeWith: "made with ❤️ for special moments"
    }
  };

  const t = translations[language];

  const generateBingoCard = () => {
    const theme = funBingoThemes[selectedTheme as keyof typeof funBingoThemes];
    const ideas = [...theme.ideas];
    const cardCells = cardSize * cardSize;
    const selectedIdeas: FunBingoIdea[] = [];

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
      isChecked: false
    })));
  };

  const toggleCell = (index: number) => {
    setBingoCard(prev => prev.map((cell, i) => 
      i === index ? { ...cell, isChecked: !cell.isChecked } : cell
    ));
  };

  const resetCard = () => {
    setBingoCard(prev => prev.map(cell => ({ ...cell, isChecked: false })));
  };

  useEffect(() => {
    generateBingoCard();
  }, [language, selectedTheme, cardSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-12 h-12 text-pink-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <Heart className="w-12 h-12 text-pink-500" />
          </div>
          <p className="text-xl text-gray-300 mb-4">{t.subtitle}</p>
          <p className="text-sm text-pink-300 italic mb-6">✨ {t.madeWith} ✨</p>
        </div>

        {/* Settings Panel */}
        <Card className="mb-8 bg-gray-900/70 border-pink-600/40 backdrop-blur-sm shadow-lg shadow-pink-900/20">
          <CardHeader>
            <CardTitle className="text-pink-400 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Setări
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  {t.language}
                </label>
                <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                  <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white hover:border-pink-500/50">
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
                  <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white hover:border-pink-500/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {Object.entries(funBingoThemes).map(([key, theme]) => (
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
                  <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white hover:border-pink-500/50">
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

            <div className="flex gap-4 mt-6 flex-wrap">
              <Button 
                onClick={generateBingoCard}
                className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-900/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.generateCard}
              </Button>
              <Button 
                onClick={resetCard}
                variant="outline"
                className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white"
              >
                {t.resetCard}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bingo Card */}
        {bingoCard.length > 0 && (
          <Card className="bg-gray-900/70 border-pink-600/40 backdrop-blur-sm shadow-2xl shadow-pink-900/30">
            <CardContent className="p-6">
              <div 
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
                        ? 'bg-gradient-to-br from-pink-600 to-purple-700 border-pink-400 shadow-lg shadow-pink-500/30 transform scale-105' 
                        : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-600/50 hover:border-pink-500/60 hover:bg-gradient-to-br hover:from-gray-700/80 hover:to-gray-800/80 hover:shadow-lg hover:shadow-pink-900/20'
                      }
                      min-h-[80px] flex flex-col items-center justify-center text-center
                      backdrop-blur-sm
                    `}
                    onClick={() => toggleCell(index)}
                  >
                    <span className={`text-xs font-medium leading-tight ${cell.isChecked ? 'text-white' : 'text-gray-200'}`}>
                      {cell.idea[language]}
                    </span>
                    {cell.isChecked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center animate-pulse">
                          <span className="text-2xl">💖</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <Badge variant="outline" className="border-pink-500/30 text-pink-400">
            Made for creating beautiful memories 💕
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default FunBingo;
