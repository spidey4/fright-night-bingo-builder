
import html2canvas from 'html2canvas';

export const downloadBingoCard = async () => {
  const cardElement = document.getElementById('bingo-card');
  if (!cardElement) {
    console.error('Bingo card element not found');
    return;
  }

  try {
    const canvas = await html2canvas(cardElement, {
      backgroundColor: '#1f2937',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement('a');
    link.download = `horror-bingo-card.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Error downloading card:', error);
  }
};
