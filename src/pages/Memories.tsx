
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Calendar,
  Heart,
  Lock,
  Plus,
  Trash2,
  Eye,
  EyeOff 
} from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  content: string;
  type: 'memory' | 'message' | 'thought';
  createdAt: string;
  openDate?: string;
  isOpened: boolean;
  imageUrl?: string;
}

const Memories = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    content: '',
    type: 'memory' as Memory['type'],
    openDate: ''
  });
  const { toast } = useToast();

  // Parola este data de 08 iunie 2025
  const correctPassword = '08062025';

  useEffect(() => {
    // Încarcă amintirile din localStorage
    const savedMemories = localStorage.getItem('private_memories');
    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    }
  }, []);

  const saveMemories = (updatedMemories: Memory[]) => {
    localStorage.setItem('private_memories', JSON.stringify(updatedMemories));
    setMemories(updatedMemories);
  };

  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      toast({
        title: "Acces permis! 💕",
        description: "Bine ai venit în secțiunea voastră privată",
      });
    } else {
      toast({
        title: "Parolă incorectă",
        description: "Încearcă din nou cu data specială",
        variant: "destructive",
      });
    }
  };

  const addMemory = () => {
    if (!newMemory.title || !newMemory.content) {
      toast({
        title: "Date incomplete",
        description: "Te rog completează titlul și conținutul",
        variant: "destructive",
      });
      return;
    }

    const memory: Memory = {
      id: Date.now().toString(),
      title: newMemory.title,
      content: newMemory.content,
      type: newMemory.type,
      createdAt: new Date().toISOString(),
      openDate: newMemory.openDate || undefined,
      isOpened: !newMemory.openDate
    };

    const updatedMemories = [...memories, memory];
    saveMemories(updatedMemories);

    setNewMemory({
      title: '',
      content: '',
      type: 'memory',
      openDate: ''
    });
    setShowAddDialog(false);

    toast({
      title: "Amintire salvată! 💝",
      description: "Amintirea a fost adăugată cu succes",
    });
  };

  const deleteMemory = (id: string) => {
    const updatedMemories = memories.filter(m => m.id !== id);
    saveMemories(updatedMemories);
    toast({
      title: "Amintire ștearsă",
      description: "Amintirea a fost eliminată",
    });
  };

  const openTimeLockedMemory = (id: string) => {
    const memory = memories.find(m => m.id === id);
    if (!memory || !memory.openDate) return;

    const openDate = new Date(memory.openDate);
    const now = new Date();

    if (now >= openDate) {
      const updatedMemories = memories.map(m => 
        m.id === id ? { ...m, isOpened: true } : m
      );
      saveMemories(updatedMemories);
      toast({
        title: "Amintire deschisă! 🎉",
        description: "Acum poți vedea conținutul acestei amintiri",
      });
    } else {
      toast({
        title: "Încă nu e timpul",
        description: `Această amintire se deschide pe ${openDate.toLocaleDateString('ro-RO')}`,
        variant: "destructive",
      });
    }
  };

  const getMemoryTypeIcon = (type: Memory['type']) => {
    switch (type) {
      case 'memory': return '💭';
      case 'message': return '💌';
      case 'thought': return '🌟';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-pink-300/30">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🔐</div>
            <CardTitle className="text-2xl text-white">Secțiunea Privată</CardTitle>
            <p className="text-pink-200">Introduceți parola pentru a accesa amintirile voastre</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-white">Parolă (data specială)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ddmmyyyy"
                className="bg-white/20 border-pink-300/50 text-white placeholder:text-pink-200"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Acces
            </Button>
            <p className="text-xs text-pink-300 text-center">
              Hint: data când v-ați cunoscut 💕
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💕 Amintirile Noastre 💕
          </h1>
          <p className="text-pink-200">
            Un loc special pentru gândurile și amintirile voastre
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adaugă Amintire
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {memories.map((memory) => {
            const canOpen = !memory.openDate || memory.isOpened || new Date() >= new Date(memory.openDate);
            
            return (
              <Card key={memory.id} className="bg-white/10 backdrop-blur-sm border-pink-300/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMemoryTypeIcon(memory.type)}</span>
                      <CardTitle className="text-white">{memory.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {memory.openDate && !memory.isOpened && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openTimeLockedMemory(memory.id)}
                          className="text-yellow-300 hover:text-yellow-200"
                        >
                          {canOpen ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMemory(memory.id)}
                        className="text-red-300 hover:text-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {canOpen ? (
                    <p className="text-pink-100 mb-4">{memory.content}</p>
                  ) : (
                    <div className="text-center py-8">
                      <Lock className="w-8 h-8 mx-auto text-yellow-300 mb-2" />
                      <p className="text-yellow-200">
                        Se deschide pe {new Date(memory.openDate!).toLocaleDateString('ro-RO')}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-pink-300">
                    <Badge variant="secondary" className="bg-pink-600/30 text-pink-200">
                      {memory.type}
                    </Badge>
                    <span>•</span>
                    <span>{new Date(memory.createdAt).toLocaleDateString('ro-RO')}</span>
                    {memory.openDate && (
                      <>
                        <span>•</span>
                        <span>📅 {new Date(memory.openDate).toLocaleDateString('ro-RO')}</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {memories.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-pink-300 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Încă nu aveți amintiri salvate
            </h3>
            <p className="text-pink-200">
              Începeți să creați primul vostru jurnal de amintiri!
            </p>
          </div>
        )}

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="bg-gray-900 border-pink-300/30">
            <DialogHeader>
              <DialogTitle className="text-white">Adaugă o Amintire Nouă</DialogTitle>
              <DialogDescription className="text-pink-200">
                Creează o amintire, un mesaj sau un gând pentru viitor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Titlu</Label>
                <Input
                  id="title"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory({...newMemory, title: e.target.value})}
                  placeholder="Titlul amintiri..."
                  className="bg-white/10 border-pink-300/50 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="content" className="text-white">Conținut</Label>
                <Textarea
                  id="content"
                  value={newMemory.content}
                  onChange={(e) => setNewMemory({...newMemory, content: e.target.value})}
                  placeholder="Scrie aici amintirea ta..."
                  rows={4}
                  className="bg-white/10 border-pink-300/50 text-white"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-white">Tip</Label>
                <select
                  id="type"
                  value={newMemory.type}
                  onChange={(e) => setNewMemory({...newMemory, type: e.target.value as Memory['type']})}
                  className="w-full p-2 rounded-md bg-white/10 border border-pink-300/50 text-white"
                >
                  <option value="memory">💭 Amintire</option>
                  <option value="message">💌 Mesaj</option>
                  <option value="thought">🌟 Gând</option>
                </select>
              </div>

              <div>
                <Label htmlFor="openDate" className="text-white">Data de deschidere (opțional)</Label>
                <Input
                  id="openDate"
                  type="date"
                  value={newMemory.openDate}
                  onChange={(e) => setNewMemory({...newMemory, openDate: e.target.value})}
                  className="bg-white/10 border-pink-300/50 text-white"
                />
                <p className="text-xs text-pink-300 mt-1">
                  Dacă setezi o dată, amintirea va fi blocată până atunci
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={addMemory}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  Salvează
                </Button>
                <Button
                  onClick={() => setShowAddDialog(false)}
                  variant="outline"
                  className="border-pink-300/50 text-pink-200 hover:bg-pink-800/20"
                >
                  Anulează
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Memories;
