
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const StardustLogo = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      setShowEasterEgg(true);
      setClickCount(0);
    }
  };

  return (
    <>
      <div 
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={handleLogoClick}
      >
        <div className="relative">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Stardust
        </span>
      </div>

      <AlertDialog open={showEasterEgg} onOpenChange={setShowEasterEgg}>
        <AlertDialogContent className="bg-gradient-to-br from-pink-900/90 to-purple-900/90 border-pink-500/30 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-pink-300 text-xl">
              💕 Pentru Elena 💕
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-pink-200 text-base leading-relaxed">
              I'm not perfect, I might not be the best boyfriend, but I will try my best to make you happy. 
              My biggest priority will always be your happiness. I love you a lot babe 💖
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StardustLogo;
