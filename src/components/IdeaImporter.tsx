
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IdeaImporterProps {
  language: 'ro' | 'en';
  onImportIdeas: (ideas: string[]) => void;
  onClose: () => void;
}

const IdeaImporter: React.FC<IdeaImporterProps> = ({ language, onImportIdeas, onClose }) => {
  const [textInput, setTextInput] = useState('');
  const [previewIdeas, setPreviewIdeas] = useState<string[]>([]);
  const { toast } = useToast();

  const translations = {
    ro: {
      title: "Import Idei Personalizate",
      subtitle: "Încarcă idei dintr-un fișier text sau tastează-le manual",
      uploadFile: "Încarcă Fișier",
      textArea: "Sau tastează ideile aici (una pe linie)",
      preview: "Previzualizare",
      ideaCount: "idei găsite",
      importIdeas: "Importă Idei",
      cancel: "Anulează",
      placeholder: "Scrie fiecare idee pe o linie nouă:\n\nIdea 1\nIdea 2\nIdea 3\netc...",
      fileError: "Eroare la citirea fișierului",
      successImport: "Idei importate cu succes!",
      noIdeas: "Nu s-au găsit idei valide",
      minIdeas: "Ai nevoie de cel puțin 3 idei pentru a crea un card"
    },
    en: {
      title: "Import Custom Ideas",
      subtitle: "Upload ideas from a text file or type them manually",
      uploadFile: "Upload File",
      textArea: "Or type ideas here (one per line)",
      preview: "Preview",
      ideaCount: "ideas found",
      importIdeas: "Import Ideas",
      cancel: "Cancel",
      placeholder: "Write each idea on a new line:\n\nIdea 1\nIdea 2\nIdea 3\netc...",
      fileError: "Error reading file",
      successImport: "Ideas imported successfully!",
      noIdeas: "No valid ideas found",
      minIdeas: "You need at least 3 ideas to create a card"
    }
  };

  const t = translations[language];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setTextInput(content);
        processText(content);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: t.fileError,
        description: "Nu s-a putut citi fișierul selectat.",
        variant: "destructive"
      });
    };
    
    reader.readAsText(file);
  };

  const processText = (text: string) => {
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#') && !line.startsWith('//'));
    
    setPreviewIdeas(lines);
  };

  const handleTextChange = (value: string) => {
    setTextInput(value);
    processText(value);
  };

  const handleImport = () => {
    if (previewIdeas.length < 3) {
      toast({
        title: t.noIdeas,
        description: t.minIdeas,
        variant: "destructive"
      });
      return;
    }

    onImportIdeas(previewIdeas);
    toast({
      title: t.successImport,
      description: `${previewIdeas.length} ${t.ideaCount}`,
    });
    onClose();
  };

  return (
    <Card className="bg-gray-900/70 border-blue-600/40 backdrop-blur-sm shadow-lg shadow-blue-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {t.title}
            </CardTitle>
            <p className="text-gray-300 text-sm mt-1">{t.subtitle}</p>
          </div>
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
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div>
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white w-full"
              asChild
            >
              <span>
                <FileText className="w-4 h-4 mr-2" />
                {t.uploadFile}
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Text Area */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.textArea}
          </label>
          <Textarea
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={t.placeholder}
            className="bg-gray-800/80 border-gray-600 text-white min-h-[150px] resize-none"
            rows={6}
          />
        </div>

        {/* Preview */}
        {previewIdeas.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              {t.preview} ({previewIdeas.length} {t.ideaCount})
            </h4>
            <div className="max-h-32 overflow-y-auto bg-gray-800/50 rounded p-3 space-y-1">
              {previewIdeas.slice(0, 10).map((idea, index) => (
                <div key={index} className="text-xs text-gray-300 py-1 border-b border-gray-700/50 last:border-b-0">
                  {index + 1}. {idea}
                </div>
              ))}
              {previewIdeas.length > 10 && (
                <div className="text-xs text-gray-400 italic">
                  ...și încă {previewIdeas.length - 10} idei
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleImport}
            disabled={previewIdeas.length < 3}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {t.importIdeas}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
          >
            {t.cancel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaImporter;
