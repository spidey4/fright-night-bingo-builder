
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, X, Copy, Check } from 'lucide-react';
import QRCodeLib from 'qrcode';

interface QRCodeShareProps {
  bingoCard: Array<{ idea: { ro: string; en: string } }>;
  language: 'ro' | 'en';
  selectedTheme: string;
  cardSize: number;
  onClose: () => void;
}

const QRCodeShare: React.FC<QRCodeShareProps> = ({
  bingoCard,
  language,
  selectedTheme,
  cardSize,
  onClose
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const translations = {
    ro: {
      title: "Partajează Card",
      shareUrl: "Link de partajare",
      copyUrl: "Copiază Link",
      copied: "Copiat!",
      qrCode: "Cod QR",
      scanInfo: "Scanează codul QR pentru a vedea cardul"
    },
    en: {
      title: "Share Card",
      shareUrl: "Share URL",
      copyUrl: "Copy Link",
      copied: "Copied!",
      qrCode: "QR Code",
      scanInfo: "Scan QR code to view the card"
    }
  };

  const t = translations[language];

  useEffect(() => {
    generateQRCode();
  }, [bingoCard, language, selectedTheme, cardSize]);

  const generateQRCode = async () => {
    const cardData = {
      theme: selectedTheme,
      size: cardSize,
      language: language,
      cards: bingoCard.map(cell => cell.idea[language])
    };

    // Use encodeURIComponent instead of btoa to handle UTF-8 characters
    const dataString = encodeURIComponent(JSON.stringify(cardData));
    const url = `${window.location.origin}?card=${dataString}`;
    setShareUrl(url);

    try {
      const qrCode = await QRCodeLib.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#dc2626',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <Card className="bg-gray-900/90 border-red-600/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-red-400 flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          {t.title}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          {qrCodeUrl && (
            <div className="bg-white p-4 rounded-lg">
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
            </div>
          )}
          <p className="text-sm text-gray-400 text-center">{t.scanInfo}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">{t.shareUrl}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-gray-800 border-gray-600 text-white px-3 py-2 rounded text-sm"
            />
            <Button
              onClick={copyToClipboard}
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  {t.copyUrl}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeShare;
