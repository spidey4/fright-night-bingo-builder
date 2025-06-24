
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit3, Save, X } from 'lucide-react';
import { BingoIdea } from '@/data/bingoData';

interface BingoCell {
  idea: BingoIdea;
  isChecked: boolean;
  isEditing: boolean;
  editedText: string;
}

interface BingoCardProps {
  bingoCard: BingoCell[];
  cardSize: number;
  language: 'ro' | 'en';
  onToggleCell: (index: number) => void;
  onStartEditing: (index: number) => void;
  onSaveEdit: (index: number) => void;
  onCancelEdit: (index: number) => void;
  onUpdateEditText: (index: number, text: string) => void;
}

const BingoCard: React.FC<BingoCardProps> = ({
  bingoCard,
  cardSize,
  language,
  onToggleCell,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onUpdateEditText
}) => {
  if (bingoCard.length === 0) return null;

  return (
    <Card className="bg-gray-900/70 border-red-600/40 backdrop-blur-sm shadow-2xl shadow-red-900/30">
      <CardContent className="p-6">
        <div 
          id="bingo-card"
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
                  ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-400 shadow-lg shadow-red-500/30 transform scale-105' 
                  : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-600/50 hover:border-red-500/60 hover:bg-gradient-to-br hover:from-gray-700/80 hover:to-gray-800/80 hover:shadow-lg hover:shadow-red-900/20'
                }
                min-h-[80px] flex flex-col items-center justify-center text-center
                backdrop-blur-sm
              `}
              onClick={() => !cell.isEditing && onToggleCell(index)}
            >
              {cell.isEditing ? (
                <div className="w-full space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={cell.editedText}
                    onChange={(e) => onUpdateEditText(index, e.target.value)}
                    className="text-xs bg-gray-900/80 border-gray-600 text-white"
                    autoFocus
                  />
                  <div className="flex gap-1 justify-center">
                    <Button
                      size="sm"
                      onClick={() => onSaveEdit(index)}
                      className="bg-green-600 hover:bg-green-700 h-6 px-2"
                    >
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCancelEdit(index)}
                      className="border-gray-600 text-gray-400 hover:bg-gray-700 h-6 px-2"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <span className={`text-xs font-medium leading-tight ${cell.isChecked ? 'text-white' : 'text-gray-200'}`}>
                    {cell.idea[language]}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartEditing(index);
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  {cell.isChecked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center animate-pulse">
                        <span className="text-2xl">💀</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BingoCard;
