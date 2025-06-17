
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface DifficultySliderProps {
  difficulty: number;
  onDifficultyChange: (value: number) => void;
  language: 'ro' | 'en';
}

const DifficultySlider: React.FC<DifficultySliderProps> = ({
  difficulty,
  onDifficultyChange,
  language
}) => {
  const translations = {
    ro: {
      difficulty: "Dificultate",
      common: "Clișee Comune",
      rare: "Clișee Rare"
    },
    en: {
      difficulty: "Difficulty",
      common: "Common Clichés",
      rare: "Rare Clichés"
    }
  };

  const t = translations[language];

  return (
    <div className="space-y-3">
      <Label className="text-gray-300">{t.difficulty}</Label>
      <div className="px-2">
        <Slider
          value={[difficulty]}
          onValueChange={(value) => onDifficultyChange(value[0])}
          max={100}
          min={0}
          step={1}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{t.common}</span>
        <span>{t.rare}</span>
      </div>
    </div>
  );
};

export default DifficultySlider;
