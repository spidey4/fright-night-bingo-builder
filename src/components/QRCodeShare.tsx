
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, QrCode, Share } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeShareProps {
  cardData: any[];
  language: 'ro' | 'en';
  onClose: () => void;
}

const QRCodeShare: React.FC<QRCodeShareProps> = ({ cardData, language, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const translations = {
    ro: {
      title: "Partajează Card QR",
      subtitle: "Scanează codul pentru a vedea cardul",
      close: "Închide",
      generateQR: "Generează QR",
      shareCard: "Partajează Card"
    },
    en: {
      title: "Share QR Card",
      subtitle: "Scan the code to view the card",
      close: "Close",
      generateQR: "Generate QR",
      shareCard: "Share Card"
    }
  };

  const t = translations[language];

  useEffect(() => {
    generateQRCode();
  }, [cardData]);

  const generateQRCode = async () => {
    try {
      const cardDataString = JSON.stringify({
        cards: cardData.map(cell => cell.idea[language]),
        language,
        timestamp: Date.now()
      });
      
      const encodedData = btoa(cardDataString);
      const shareUrl = `${window.location.origin}?shared=${encodedData}`;
      
      const qrUrl = await QRCode.toDataURL(shareUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#DC2626',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <Card className="bg-gray-900/90 border-red-600/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-red-400">{t.title}</CardTitle>
          <p className="text-sm text-gray-300 mt-1">{t.subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {qrCodeUrl && (
          <div className="bg-white p-4 rounded-lg">
            <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
          </div>
        )}
        <Button
          onClick={generateQRCode}
          className="bg-red-600 hover:bg-red-700"
        >
          <QrCode className="w-4 h-4 mr-2" />
          {t.generateQR}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeShare;
