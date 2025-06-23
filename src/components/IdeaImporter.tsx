
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IdeaImporterProps {
  language: 'ro' | 'en';
  onImportIdeas: (ideas: string[]) => void;
  onClose: () => void;
}

const IdeaImporter: React.FC<IdeaImporterProps> = ({ language, onImportIdeas, onClose }) => {
  const [ideaText, setIdeaText] = useState('');
  const { toast } = useToast();

  const translations = {
    ro: {
      title: "Import Idei pentru Card Custom",
      placeholder: "Scrie sau lipește ideile tale aici, câte una pe rând:\n\nIdee 1\nIdee 2\nIdee 3\n...",
      importFromFile: "Import din fișier",
      generateCard: "Generează Card",
      cancel: "Anulează",
      successTitle: "Idei importate!",
      successDesc: "Card-ul a fost generat cu ideile tale.",
      errorTitle: "Eroare",
      errorDesc: "Te rog adaugă cel puțin o idee.",
      fileErrorDesc: "Eroare la citirea fișierului. Te rog încearcă din nou."
    },
    en: {
      title: "Import Ideas for Custom Card",
      placeholder: "Write or paste your ideas here, one per line:\n\nIdea 1\nIdea 2\nIdea 3\n...",
      importFromFile: "Import from file",
      generateCard: "Generate Card",
      cancel: "Cancel",
      successTitle: "Ideas imported!",
      successDesc: "Card has been generated with your ideas.",
      errorTitle: "Error",
      errorDesc: "Please add at least one idea.",
      fileErrorDesc: "Error reading file. Please try again."
    }
  };

  const t = translations[language];

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setIdeaText(content);
      }
    };
    reader.onerror = () => {
      toast({
        title: t.errorTitle,
        description: t.fileErrorDesc,
        variant: "destructive"
      });
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const ideas = ideaText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (ideas.length === 0) {
      toast({
        title: t.errorTitle,
        description: t.errorDesc,
        variant: "destructive"
      });
      return;
    }

    onImportIdeas(ideas);
    toast({
      title: t.successTitle,
      description: t.successDesc,
    });
  };

  return (
    <Card className="bg-gray-900/70 border-blue-600/40 backdrop-blur-sm shadow-lg shadow-blue-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t.title}
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder={t.placeholder}
            className="min-h-[200px] bg-gray-800/80 border-blue-600/50 text-white resize-y"
          />
          
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                {t.importFromFile}
              </Button>
            </div>
            
            <Button
              onClick={handleImport}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={ideaText.trim().length === 0}
            >
              {t.generateCard}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
            >
              {t.cancel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaImporter;
