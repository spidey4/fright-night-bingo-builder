
export class SoundEffects {
  private static instance: SoundEffects;
  private enabled: boolean = true;

  static getInstance(): SoundEffects {
    if (!SoundEffects.instance) {
      SoundEffects.instance = new SoundEffects();
    }
    return SoundEffects.instance;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('horror-bingo-sounds', JSON.stringify(enabled));
  }

  isEnabled(): boolean {
    const stored = localStorage.getItem('horror-bingo-sounds');
    if (stored) {
      this.enabled = JSON.parse(stored);
    }
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaBS2A0PLZhzYIF2e+7OOaLwkA');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  playBingo() {
    if (!this.enabled) return;
    
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaBS2A0PLZhzYIF2e+7OOaLwkA');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }

  playFavorite() {
    if (!this.enabled) return;
    
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaBS2A0PLZhzYIF2e+7OOaLwkA');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }
}

export const soundEffects = SoundEffects.getInstance();
