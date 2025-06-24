import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { bingoThemes } from '@/data/bingoData';

interface CustomTheme {
  id: string;
  name: { ro: string; en: string };
  ideas: any[];
}

interface ThemeSelectorProps {
  language: 'ro' | 'en';
  selectedThemes: string[];
  onToggleTheme: (themeKey: string) => void;
  includeCursedDoll: boolean;
  includeJumpscare: boolean;
  includeGothic: boolean;
  includeCult: boolean;
  includeZombie: boolean;
  onOptionalThemeChange: (themeName: string, checked: boolean) => void;
  customThemes: CustomTheme[];
  onDeleteCustomTheme: (themeId: string) => void;
  showCustomThemeCreator: boolean;
  onToggleCustomThemeCreator: () => void;
  newThemeName: { ro: string; en: string };
  onNewThemeNameChange: (name: { ro: string; en: string }) => void;
  newThemeIdeas: { ro: string; en: string }[];
  onNewThemeIdeasChange: (ideas: { ro: string; en: string }[]) => void;
  onSaveCustomTheme: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  language,
  selectedThemes,
  onToggleTheme,
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
      optionalThemes: "Teme Opționale",
      customThemes: "Teme Personalizate",
      createCustomTheme: "Creează Temă Nouă",
      themeName: "Numele temei",
      addIdea: "Adaugă Idee",
      saveTheme: "Salvează Tema",
      cancelTheme: "Anulează"
    },
    en: {
      optionalThemes: "Optional Themes",
      customThemes: "Custom Themes",
      createCustomTheme: "Create New Theme",
      themeName: "Theme name",
      addIdea: "Add Idea",
      saveTheme: "Save Theme",
      cancelTheme: "Cancel"
    }
  };

  const t = translations[language];

  const addNewIdea = () => {
    onNewThemeIdeasChange([...newThemeIdeas, { ro: '', en: '' }]);
  };

  const removeIdea = (index: number) => {
    onNewThemeIdeasChange(newThemeIdeas.filter((_, i) => i !== index));
  };

  const updateIdeaText = (index: number, lang: 'ro' | 'en', text: string) => {
    const updatedIdeas = [...newThemeIdeas];
    updatedIdeas[index][lang] = text;
    onNewThemeIdeasChange(updatedIdeas);
  };

  return (
    <div className="space-y-6">
      {/* Main Themes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-800/50 rounded-lg">
        {Object.entries(bingoThemes).map(([key, theme]) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={selectedThemes.includes(key)}
              onCheckedChange={() => onToggleTheme(key)}
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
                  onCheckedChange={(checked) => onOptionalThemeChange(key, checked === true)}
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
            onClick={onToggleCustomThemeCreator}
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
                onChange={(e) => onNewThemeNameChange({...newThemeName, ro: e.target.value})}
                className="bg-gray-800 border-blue-600"
              />
              <Input
                placeholder="Theme name (English)"
                value={newThemeName.en}
                onChange={(e) => onNewThemeNameChange({...newThemeName, en: e.target.value})}
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
                onClick={onSaveCustomTheme}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t.saveTheme}
              </Button>
              <Button
                onClick={() => {
                  onToggleCustomThemeCreator();
                  onNewThemeNameChange({ ro: '', en: '' });
                  onNewThemeIdeasChange([{ ro: '', en: '' }]);
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
                    onCheckedChange={() => onToggleTheme(theme.id)}
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
                  onClick={() => onDeleteCustomTheme(theme.id)}
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
  );
};

export default ThemeSelector;
