import React from 'react';
import QrReader from 'modern-react-qr-reader';

const QRScanner = ({ onScan, onError, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-0 right-0 p-2 bg-red-600 text-white rounded-full"
          onClick={onClose}
        >
          X
        </button>
        <QrReader
          delay={300}
          onError={onError}
          onScan={onScan}
          style={{ width: '100%' }}
        />
        <p className="mt-4">Scan the QR code of the book to return</p>
      </div>
    </div>
  );
};

export default QRScanner;
