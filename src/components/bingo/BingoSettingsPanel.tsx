
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skull, RefreshCw, Download, ChevronDown, ChevronUp } from 'lucide-react';
import DifficultySlider from '@/components/DifficultySlider';
import ThemeSelector from './ThemeSelector';
import { bingoThemes } from '@/data/bingoData';

type Language = 'ro' | 'en';
type CardSize = 3 | 4 | 5;

interface BingoSettingsPanelProps {
  language: Language;
  selectedThemes: string[];
  cardSize: CardSize;
  difficulty: number;
  showThemeSelector: boolean;
  importedIdeas: string[];
  onLanguageChange: (language: Language) => void;
  onCardSizeChange: (size: CardSize) => void;
  onDifficultyChange: (difficulty: number) => void;
  onToggleThemeSelector: () => void;
  onToggleTheme: (themeKey: string) => void;
  onGenerateCard: () => void;
  onResetCard: () => void;
  onDownloadCard: () => void;
  // Optional themes props
  includeCursedDoll: boolean;
  includeJumpscare: boolean;
  includeGothic: boolean;
  includeCult: boolean;
  includeZombie: boolean;
  onOptionalThemeChange: (themeName: string, checked: boolean) => void;
  // Custom themes props
  customThemes: any[];
  onDeleteCustomTheme: (themeId: string) => void;
  showCustomThemeCreator: boolean;
  onToggleCustomThemeCreator: () => void;
  newThemeName: { ro: string; en: string };
  onNewThemeNameChange: (name: { ro: string; en: string }) => void;
  newThemeIdeas: { ro: string; en: string }[];
  onNewThemeIdeasChange: (ideas: { ro: string; en: string }[]) => void;
  onSaveCustomTheme: () => void;
}

const BingoSettingsPanel: React.FC<BingoSettingsPanelProps> = ({
  language,
  selectedThemes,
  cardSize,
  difficulty,
  showThemeSelector,
  importedIdeas,
  onLanguageChange,
  onCardSizeChange,
  onDifficultyChange,
  onToggleThemeSelector,
  onToggleTheme,
  onGenerateCard,
  onResetCard,
  onDownloadCard,
  includeCursedDoll,
  includeJumpscare,
  includeGothic,
  includeCult,
  includeZombie,
  onOptionalThemeChange,
  customThemes,
  onDeleteCustomTheme,
  showCustomThemeCreator,
  onToggleCustomThemeCreator,
  newThemeName,
  onNewThemeNameChange,
  newThemeIdeas,
  onNewThemeIdeasChange,
  onSaveCustomTheme
}) => {
  const translations = {
    ro: {
      settings: "Setări",
      language: "Limbă",
      cardSize: "Mărimea cardului",
      themes: "Teme filme",
      generateCard: "Generează Card",
      resetCard: "Resetează Card",
      downloadCard: "Descarcă Card",
      showThemes: "Arată Teme",
      hideThemes: "Ascunde Teme",
      selectMultiple: "Selectează mai multe teme pentru varietate"
    },
    en: {
      settings: "Settings",
      language: "Language",
      cardSize: "Card size",
      themes: "Movie themes",
      generateCard: "Generate Card",
      resetCard: "Reset Card",
      downloadCard: "Download Card",
      showThemes: "Show Themes",
      hideThemes: "Hide Themes",
      selectMultiple: "Select multiple themes for variety"
    }
  };

  const t = translations[language];

  return (
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
            <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)}>
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
            <Select value={cardSize.toString()} onValueChange={(value) => onCardSizeChange(parseInt(value) as CardSize)}>
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
              onDifficultyChange={onDifficultyChange}
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
              onClick={onToggleThemeSelector}
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
            <ThemeSelector
              language={language}
              selectedThemes={selectedThemes}
              onToggleTheme={onToggleTheme}
              includeCursedDoll={includeCursedDoll}
              includeJumpscare={includeJumpscare}
              includeGothic={includeGothic}
              includeCult={includeCult}
              includeZombie={includeZombie}
              onOptionalThemeChange={onOptionalThemeChange}
              customThemes={customThemes}
              onDeleteCustomTheme={onDeleteCustomTheme}
              showCustomThemeCreator={showCustomThemeCreator}
              onToggleCustomThemeCreator={onToggleCustomThemeCreator}
              newThemeName={newThemeName}
              onNewThemeNameChange={onNewThemeNameChange}
              newThemeIdeas={newThemeIdeas}
              onNewThemeIdeasChange={onNewThemeIdeasChange}
              onSaveCustomTheme={onSaveCustomTheme}
            />
          )}
        </div>

        <div className="flex gap-4 mt-6 flex-wrap">
          <Button 
            onClick={onGenerateCard}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30"
            disabled={selectedThemes.length === 0 && importedIdeas.length === 0}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.generateCard}
          </Button>
          <Button 
            onClick={onResetCard}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          >
            {t.resetCard}
          </Button>
          <Button 
            onClick={onDownloadCard}
            variant="outline"
            className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.downloadCard}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BingoSettingsPanel;
