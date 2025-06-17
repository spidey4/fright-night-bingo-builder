
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X, Volume2, VolumeX } from 'lucide-react';

interface SoundEffectsProps {
  language: 'ro' | 'en';
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
}

const SoundEffects: React.FC<SoundEffectsProps> = ({
  language,
  onClose,
  soundEnabled,
  onToggleSound
}) => {
  const translations = {
    ro: {
      title: "Efecte Sonore",
      subtitle: "Controlează sunetele din joc",
      close: "Închide",
      enableSounds: "Activează Sunete",
      testClick: "Test Sunet Click",
      testBingo: "Test Sunet Bingo",
      soundEnabled: "Sunetele sunt activate",
      soundDisabled: "Sunetele sunt dezactivate"
    },
    en: {
      title: "Sound Effects",
      subtitle: "Control game sounds",
      close: "Close",
      enableSounds: "Enable Sounds",
      testClick: "Test Click Sound",
      testBingo: "Test Bingo Sound",
      soundEnabled: "Sounds are enabled",
      soundDisabled: "Sounds are disabled"
    }
  };

  const t = translations[language];

  const playClickSound = () => {
    if (!soundEnabled) return;
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaBS2A0PLZhzYIF2e+7OOaL.Kio2MyNVqkz9avYSIEMYPB8tyILQkaf7Lm6qZSFAhBpN/ww2EdBjSL2O/FdSAFKXjI8N2QQAoUXrTp66hVFAtGo+HywGAaBytx0fDceywHInyy5+2iTRUIQK3h7Zp2HwIm');
    audio.play().catch(() => {});
  };

  const playBingoSound = () => {
    if (!soundEnabled) return;
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaBS2A0PLZhzYIF2e+7OOaLwwPAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==');
    audio.play().catch(() => {});
  };

  return (
    <Card className="bg-gray-900/90 border-green-600/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-green-400">{t.title}</CardTitle>
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
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-green-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-gray-200">{t.enableSounds}</span>
          </div>
          <Switch
            checked={soundEnabled}
            onCheckedChange={onToggleSound}
          />
        </div>

        <div className="text-sm text-gray-400">
          {soundEnabled ? t.soundEnabled : t.soundDisabled}
        </div>

        {soundEnabled && (
          <div className="space-y-3">
            <Button
              onClick={playClickSound}
              variant="outline"
              className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            >
              {t.testClick}
            </Button>
            <Button
              onClick={playBingoSound}
              variant="outline"
              className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            >
              {t.testBingo}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SoundEffects;
