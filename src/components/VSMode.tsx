
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Target } from 'lucide-react';

interface VSModeProps {
  language: 'ro' | 'en';
  onStartVSGame: (player1Name: string, player2Name: string) => void;
  gameState?: {
    isActive: boolean;
    player1: { name: string; score: number };
    player2: { name: string; score: number };
    currentRound: number;
  };
  onBingo: (playerNumber: 1 | 2) => void;
}

const VSMode: React.FC<VSModeProps> = ({
  language,
  onStartVSGame,
  gameState,
  onBingo
}) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const translations = {
    ro: {
      title: "Modul VS (Competitiv)",
      player1: "Jucător 1",
      player2: "Jucător 2",
      startGame: "Începe Jocul",
      bingo: "BINGO!",
      score: "Scor",
      round: "Runda",
      winner: "Câștigător",
      enterNames: "Introduceți numele jucătorilor"
    },
    en: {
      title: "VS Mode (Competitive)",
      player1: "Player 1",
      player2: "Player 2",
      startGame: "Start Game",
      bingo: "BINGO!",
      score: "Score",
      round: "Round",
      winner: "Winner",
      enterNames: "Enter player names"
    }
  };

  const t = translations[language];

  if (gameState?.isActive) {
    return (
      <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t.title} - {t.round} {gameState.currentRound}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-gray-200">{gameState.player1.name}</h3>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                {t.score}: {gameState.player1.score}
              </Badge>
              <Button
                onClick={() => onBingo(1)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                {t.bingo}
              </Button>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-gray-200">{gameState.player2.name}</h3>
              <Badge variant="outline" className="border-green-500 text-green-400">
                {t.score}: {gameState.player2.score}
              </Badge>
              <Button
                onClick={() => onBingo(2)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                {t.bingo}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <Users className="w-5 h-5" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              {t.player1}
            </label>
            <Input
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              placeholder={t.player1}
              className="bg-gray-800/80 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              {t.player2}
            </label>
            <Input
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              placeholder={t.player2}
              className="bg-gray-800/80 border-gray-600 text-white"
            />
          </div>
        </div>
        
        <Button
          onClick={() => onStartVSGame(player1Name, player2Name)}
          disabled={!player1Name.trim() || !player2Name.trim()}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          <Trophy className="w-4 h-4 mr-2" />
          {t.startGame}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VSMode;
