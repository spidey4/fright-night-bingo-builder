
import html2canvas from 'html2canvas';

export const downloadCard = async (card: string[][], marked: boolean[][], translations: any, language: 'ro' | 'en') => {
  const cardElement = document.getElementById('bingo-card');
  if (!cardElement) return;

  try {
    const canvas = await html2canvas(cardElement, {
      backgroundColor: '#1f2937',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement('a');
    link.download = `horror-bingo-${card.length}x${card.length}-${language}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Error downloading card:', error);
  }
};

export const downloadBingoCard = async (cardSize: number, language: 'ro' | 'en') => {
  const cardElement = document.getElementById('bingo-card');
  if (!cardElement) return;

  try {
    const canvas = await html2canvas(cardElement, {
      backgroundColor: '#1f2937',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement('a');
    link.download = `horror-bingo-${cardSize}x${cardSize}-${language}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Error downloading card:', error);
  }
};
