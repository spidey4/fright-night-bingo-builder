
import React, { useState } from 'react';
import { Skull } from 'lucide-react';
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
        className="fixed top-4 left-4 z-50 flex items-center gap-2 cursor-pointer select-none"
        onClick={handleLogoClick}
      >
        <div className="relative">
          <Skull className="w-6 h-6 text-red-400" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
          Stardust
        </span>
      </div>

      <AlertDialog open={showEasterEgg} onOpenChange={setShowEasterEgg}>
        <AlertDialogContent className="bg-gradient-to-br from-red-900/90 to-gray-900/90 border-red-500/30 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-red-300 text-xl">
              💀 Pentru Elena 💀
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-red-200 text-base leading-relaxed">
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
