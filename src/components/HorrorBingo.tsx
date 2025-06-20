import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skull, RotateCcw, Download, Share2, Zap, Users, Film, ChevronDown, ChevronUp, Globe, Languages } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ClicheExcluder from './ClicheExcluder';
import DifficultySlider from './DifficultySlider';
import VSMode from './VSMode';
import QRCodeShare from './QRCodeShare';
import MovieSuggester from './MovieSuggester';
import { downloadCard } from '@/utils/downloadCard';

const bingoIdeas = [
  "Jump Scare",
  "Creepy Doll",
  "Basement Scene",
  "Screaming",
  "Someone Trips While Running",
  "Obvious Trap",
  "Protagonist Makes a Dumb Decision",
  "Flashback Scene",
  "Spooky Music",
  "Red Herring",
  "Main Character Dies",
  "Monster Reveal",
  "Someone Whispers",
  "Abandoned Building",
  "Stormy Weather",
  "Mysterious Phone Call",
  "Someone is Dragged Away",
  "Symbolism",
  "False Sense of Security",
  "Characters Split Up",
  "The Power of Friendship Saves the Day",
  "It Was All a Dream",
  "Based on a True Story",
  "The Dog Dies",
  "Final Girl Trope"
];

const getDifficultyIdeas = (difficulty: number) => {
  const easy = [
    "Jump Scare",
    "Screaming",
    "Spooky Music",
    "Stormy Weather",
    "Red Herring",
    "Creepy Doll",
    "Basement Scene",
    "Abandoned Building",
  ];
  const medium = [
    "Obvious Trap",
    "Protagonist Makes a Dumb Decision",
    "Flashback Scene",
    "Mysterious Phone Call",
    "Symbolism",
    "False Sense of Security",
    "Characters Split Up",
    "Someone is Dragged Away",
  ];
  const hard = [
    "Main Character Dies",
    "Monster Reveal",
    "Someone Whispers",
    "Someone Trips While Running",
    "The Power of Friendship Saves the Day",
    "It Was All a Dream",
    "Based on a True Story",
    "The Dog Dies",
    "Final Girl Trope"
  ];

  if (difficulty <= 33) return easy;
  if (difficulty <= 66) return [...easy, ...medium];
  return [...easy, ...medium, ...hard];
}

const cardSize = 5;
const defaultClicheExclusionCount = 3;

const HorrorBingo = () => {
  const [card, setCard] = useState<string[][]>([]);
  const [marked, setMarked] = useState<boolean[][]>([]);
  const [difficulty, setDifficulty] = useState<number>(50);
  const [vsMode, setVsMode] = useState<boolean>(false);
  const [clicheExclusionCount, setClicheExclusionCount] = useState<number>(defaultClicheExclusionCount);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [shareURL, setShareURL] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [language, setLanguage] = useState<'ro' | 'en'>('en');
  const [showMovieSuggester, setShowMovieSuggester] = useState(false);
  const [selectedMovieThemes, setSelectedMovieThemes] = useState<string[]>([]);

  useEffect(() => {
    generateCard();
  }, [difficulty, clicheExclusionCount]);

  useEffect(() => {
    if (showShare && !shareURL) {
      generateShareURL();
    }
  }, [showShare]);

  const generateCard = () => {
    const availableIdeas = getDifficultyIdeas(difficulty);
    let filteredIdeas = [...availableIdeas];

    // Exclude cliches
    for (let i = 0; i < clicheExclusionCount; i++) {
      if (filteredIdeas.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredIdeas.length);
        filteredIdeas.splice(randomIndex, 1);
      }
    }

    const newCard: string[][] = [];
    const selectedIdeas: string[] = [];

    for (let i = 0; i < cardSize; i++) {
      newCard[i] = [];
      for (let j = 0; j < cardSize; j++) {
        let randomIndex;
        let idea;

        if (selectedIdeas.length >= filteredIdeas.length) {
          randomIndex = Math.floor(Math.random() * availableIdeas.length);
          idea = availableIdeas[randomIndex];
        } else {
          randomIndex = Math.floor(Math.random() * filteredIdeas.length);
          idea = filteredIdeas[randomIndex];
        }

        newCard[i][j] = idea;
        selectedIdeas.push(idea);
      }
    }

    setCard(newCard);
    setMarked(Array(cardSize).fill(null).map(() => Array(cardSize).fill(false)));
  };

  const markCell = (row: number, col: number) => {
    const newMarked = marked.map((rowMarked, rowIndex) =>
      rowMarked.map((cellMarked, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return !cellMarked;
        }
        return cellMarked;
      })
    );
    setMarked(newMarked);
  };

  const resetCard = () => {
    generateCard();
    setMarked(Array(cardSize).fill(null).map(() => Array(cardSize).fill(false)));
    toast({
      title: t.cardReset,
      description: t.newCardGenerated,
    });
  };

  const generateShareURL = async () => {
    const cardData = {
      card: card,
      marked: marked,
      difficulty: difficulty,
      vsMode: vsMode,
      clicheExclusionCount: clicheExclusionCount,
      language: language
    };

    try {
      const cardDataString = JSON.stringify(cardData);
      const encodedCardData = btoa(cardDataString);
      const baseURL = window.location.origin;
      const shareLink = `${baseURL}/?cardData=${encodedCardData}`;
      setShareURL(shareLink);
    } catch (error) {
      console.error("Error generating share URL:", error);
      toast({
        title: t.shareError,
        description: t.tryAgain,
      });
    }
  };

  const handleDownloadCard = async () => {
    setIsDownloading(true);
    try {
      await downloadCard(card, marked, t, language);
    } catch (error) {
      console.error("Error downloading card:", error);
      toast({
        title: t.downloadError,
        description: t.tryAgain,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const translations = {
    ro: {
      title: "Bingo de Filme Horror",
      generate: "Generează Card",
      reset: "Resetează Card",
      difficulty: "Dificultate",
      cliches: "Excludează Cliche-uri",
      cardReset: "Card Resetat!",
      newCardGenerated: "Un nou card a fost generat.",
      download: "Descarcă",
      share: "Partajează",
      shareCard: "Partajează Cardul",
      shareURLCopied: "URL-ul de partajare a fost copiat în clipboard!",
      shareError: "Eroare la partajare",
      tryAgain: "Încearcă din nou.",
      downloading: "Se descarcă...",
      downloadError: "Eroare la descărcare",
      vsMode: "Modul VS",
      enableVSMode: "Activează Modul VS",
      disableVSMode: "Dezactivează Modul VS",
      language: "Limbă",
      movieSuggester: "Sugestii de Filme",
      movieThemes: "Teme de Filme",
      selectMovieTheme: "Selectează o temă"
    },
    en: {
      title: "Horror Movie Bingo",
      generate: "Generate Card",
      reset: "Reset Card",
      difficulty: "Difficulty",
      cliches: "Exclude Cliches",
      cardReset: "Card Reset!",
      newCardGenerated: "A new card has been generated.",
      download: "Download",
      share: "Share",
      shareCard: "Share Card",
      shareURLCopied: "Share URL copied to clipboard!",
      shareError: "Share Error",
      tryAgain: "Try again.",
      downloading: "Downloading...",
      downloadError: "Download Error",
      vsMode: "VS Mode",
      enableVSMode: "Enable VS Mode",
      disableVSMode: "Disable VS Mode",
      language: "Language",
      movieSuggester: "Movie Suggester",
      movieThemes: "Movie Themes",
      selectMovieTheme: "Select a theme"
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-900/90 border-red-600/40 backdrop-blur-sm mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold text-red-500 flex items-center gap-2">
              <Skull className="w-6 h-6" />
              {t.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={language} onValueChange={(value: 'ro' | 'en') => setLanguage(value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t.language} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="en" className="text-white hover:bg-gray-700">
                    English
                  </SelectItem>
                  <SelectItem value="ro" className="text-white hover:bg-gray-700">
                    Română
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm" id="bingo-card">
              <CardHeader>
                <CardTitle className="text-red-400">
                  {vsMode ? "💀 VS Mode 💀" : t.generate}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-5 gap-2">
                {card.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <Button
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-full h-16 p-2 break-words text-sm ${marked[rowIndex][colIndex] ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                        onClick={() => markCell(rowIndex, colIndex)}
                        disabled={isDownloading}
                      >
                        {cell}
                      </Button>
                    ))}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {t.generate}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={resetCard}
                  disabled={isDownloading}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t.reset}
                </Button>

                <Separator className="bg-gray-600" />

                <DifficultySlider difficulty={difficulty} onDifficultyChange={setDifficulty} language={language} />

                <Separator className="bg-gray-600" />

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t.cliches}
                  </label>
                  <div className="text-gray-400 text-sm mb-2">
                    {language === 'ro' 
                      ? `Excluzând ${clicheExclusionCount} clichee` 
                      : `Excluding ${clicheExclusionCount} clichés`
                    }
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={clicheExclusionCount}
                    onChange={(e) => setClicheExclusionCount(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <Separator className="bg-gray-600" />

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">
                    {t.vsMode}
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVsMode(!vsMode)}
                    className={vsMode ? "bg-green-600 border-green-500 text-white" : "border-gray-600 text-gray-400"}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {vsMode ? t.disableVSMode : t.enableVSMode}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Movie Suggester */}
            <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle 
                  className="text-red-400 flex items-center justify-between cursor-pointer"
                  onClick={() => setShowMovieSuggester(!showMovieSuggester)}
                >
                  <div className="flex items-center gap-2">
                    <Film className="w-5 h-5" />
                    {t.movieSuggester}
                  </div>
                  {showMovieSuggester ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
              {showMovieSuggester && (
                <CardContent className="space-y-4">
                  <MovieSuggester selectedTheme="horror" language={language} />
                </CardContent>
              )}
            </Card>

            <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  {t.shareCard}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setShowShare(!showShare)}
                  disabled={isDownloading}
                >
                  {t.share}
                </Button>

                {showShare && shareURL && (
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">Share URL:</p>
                    <input
                      type="text"
                      value={shareURL}
                      readOnly
                      className="w-full bg-gray-700 text-white p-2 rounded text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  {t.download}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDownloadCard}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      {t.downloading}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      {t.download}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorrorBingo;
