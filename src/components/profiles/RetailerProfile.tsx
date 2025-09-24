import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'react-qr-code';
import { Download, QrCode, User, MapPin, Phone, Store, Package } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface RetailerProfileData {
  name: string;
  storeName: string;
  location: string;
  contact: string;
  productsHandled: string[];
  stockUnits: number;
}

const RetailerProfile: React.FC = () => {
  const { user } = useApp();
  const [profile, setProfile] = useState<RetailerProfileData>({
    name: user?.name || '',
    storeName: 'Kirana Fresh Store',
    location: 'Mumbai, India',
    contact: '+91 98765-43213',
    productsHandled: ['Organic Tomatoes', 'Fresh Carrots', 'Bell Peppers', 'Organic Lettuce'],
    stockUnits: 150
  });

  const [qrSeed, setQrSeed] = useState<string>(uuidv4());

  const qrValue = useMemo(() => (
    JSON.stringify({ 
      type: 'retailer-profile', 
      userId: user?.id, 
      seed: qrSeed, 
      data: { 
        name: profile.name, 
        storeName: profile.storeName,
        location: profile.location,
        contact: profile.contact
      } 
    })
  ), [qrSeed, user?.id, profile]);

  const handleUpdate = (updates: Partial<RetailerProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setQrSeed(uuidv4());
  };

  const downloadRef = useRef<HTMLDivElement>(null);
  const handleDownloadQR = () => {
    const svg = downloadRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `retailer-profile-${user?.id}.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Retailer Profile</h2>
        <p className="text-gray-600">Manage your store information and credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><User className="w-4 h-4 mr-2"/>Name</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.name} onChange={(e) => handleUpdate({ name: e.target.value })}/>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><Store className="w-4 h-4 mr-2"/>Store Name</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.storeName} onChange={(e) => handleUpdate({ storeName: e.target.value })}/>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><MapPin className="w-4 h-4 mr-2"/>Location</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.location} onChange={(e) => handleUpdate({ location: e.target.value })}/>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><Phone className="w-4 h-4 mr-2"/>Contact</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.contact} onChange={(e) => handleUpdate({ contact: e.target.value })}/>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><Package className="w-4 h-4 mr-2"/>Stock (units)</label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.stockUnits} onChange={(e) => handleUpdate({ stockUnits: Number(e.target.value || 0) })}/>
              </div>
            </div>
          </div>

          {/* Products Handled */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products in Store</h3>
            <div className="flex flex-wrap gap-2">
              {profile.productsHandled.map((product, idx) => (
                <span key={idx} className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  <Store className="w-4 h-4 mr-1"/>
                  {product}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Profile QR */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6" ref={downloadRef}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <QrCode className="w-5 h-5 mr-2"/>Profile QR Code
            </h3>
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCode value={qrValue} size={180} />
            </div>
            <div className="mt-4">
              <button onClick={handleDownloadQR} className="inline-flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg text-sm">
                <Download className="w-4 h-4 mr-1"/>Download QR
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share this QR for store verification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerProfile;