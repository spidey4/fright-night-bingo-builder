
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2, Palette } from 'lucide-react';
import { BingoIdea } from '@/data/bingoData';

interface CustomTheme {
  id: string;
  name: { ro: string; en: string };
  ideas: BingoIdea[];
}

interface CustomThemesProps {
  language: 'ro' | 'en';
  onClose: () => void;
  onThemeCreated: (theme: CustomTheme) => void;
  customThemes: CustomTheme[];
  onDeleteTheme: (themeId: string) => void;
}

const CustomThemes: React.FC<CustomThemesProps> = ({
  language,
  onClose,
  onThemeCreated,
  customThemes,
  onDeleteTheme
}) => {
  const [themeName, setThemeName] = useState({ ro: '', en: '' });
  const [ideas, setIdeas] = useState<string>('');

  const translations = {
    ro: {
      title: "Teme Personalizate",
      subtitle: "Creează-ți propriile teme de bingo",
      close: "Închide",
      themeName: "Nume Temă",
      themeNameRo: "Nume în română",
      themeNameEn: "Nume în engleză",
      ideas: "Clișee (una pe linie)",
      createTheme: "Creează Temă",
      existingThemes: "Teme Existente",
      delete: "Șterge"
    },
    en: {
      title: "Custom Themes",
      subtitle: "Create your own bingo themes",
      close: "Close",
      themeName: "Theme Name",
      themeNameRo: "Name in Romanian",
      themeNameEn: "Name in English",
      ideas: "Clichés (one per line)",
      createTheme: "Create Theme",
      existingThemes: "Existing Themes",
      delete: "Delete"
    }
  };

  const t = translations[language];

  const handleCreateTheme = () => {
    if (!themeName.ro || !themeName.en || !ideas.trim()) return;

    const ideaLines = ideas.split('\n').filter(line => line.trim());
    const themeIdeas: BingoIdea[] = ideaLines.map(idea => ({
      ro: idea.trim(),
      en: idea.trim()
    }));

    const newTheme: CustomTheme = {
      id: `custom_${Date.now()}`,
      name: themeName,
      ideas: themeIdeas
    };

    onThemeCreated(newTheme);
    setThemeName({ ro: '', en: '' });
    setIdeas('');
  };

  return (
    <Card className="bg-gray-900/90 border-purple-600/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-purple-400">{t.title}</CardTitle>
          <p className="text-sm text-gray-300 mt-1">{t.subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.themeNameRo}</label>
            <Input
              value={themeName.ro}
              onChange={(e) => setThemeName(prev => ({ ...prev, ro: e.target.value }))}
              className="bg-gray-800 border-gray-600"
              placeholder="ex: Zombi"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.themeNameEn}</label>
            <Input
              value={themeName.en}
              onChange={(e) => setThemeName(prev => ({ ...prev, en: e.target.value }))}
              className="bg-gray-800 border-gray-600"
              placeholder="ex: Zombie"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">{t.ideas}</label>
          <Textarea
            value={ideas}
            onChange={(e) => setIdeas(e.target.value)}
            className="bg-gray-800 border-gray-600 h-32"
            placeholder="Zombi face zgomot&#10;Victima cade&#10;Ușa care scârțâie"
          />
        </div>

        <Button
          onClick={handleCreateTheme}
          className="bg-purple-600 hover:bg-purple-700 w-full"
          disabled={!themeName.ro || !themeName.en || !ideas.trim()}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.createTheme}
        </Button>

        {customThemes.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">{t.existingThemes}</h3>
            <div className="space-y-2">
              {customThemes.map(theme => (
                <div key={theme.id} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                  <div>
                    <span className="text-white font-medium">{theme.name[language]}</span>
                    <span className="text-gray-400 text-sm ml-2">
                      ({theme.ideas.length} {language === 'ro' ? 'clișee' : 'clichés'})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTheme(theme.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomThemes;
