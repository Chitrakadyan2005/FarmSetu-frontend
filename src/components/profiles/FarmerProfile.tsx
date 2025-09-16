import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'react-qr-code';
import { Download, QrCode, User, MapPin, Phone, Sprout } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FarmerProfileData {
  name: string;
  location: string;
  contact: string;
  crops: string[];
  stockKg: number;
  connectedDistributors: string[];
}

const FarmerProfile: React.FC = () => {
  const { user } = useApp();
  const [profile, setProfile] = useState<FarmerProfileData>({
    name: user?.name || '',
    location: 'California, USA',
    contact: '+1 555-0101',
    crops: ['Tomatoes', 'Carrots'],
    stockKg: 120,
    connectedDistributors: ['Green Valley Distributors']
  });

  const [qrSeed, setQrSeed] = useState<string>(uuidv4());

  const qrValue = useMemo(() => (
    JSON.stringify({
      type: 'farmer-profile',
      userId: user?.id,
      seed: qrSeed,
      data: {
        name: profile.name,
        location: profile.location,
        crops: profile.crops,
        stockKg: profile.stockKg,
      }
    })
  ), [qrSeed, user?.id, profile]);

  const handleUpdate = (updates: Partial<FarmerProfileData>) => {
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
      a.download = `farmer-profile-${user?.id}.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Farmer Profile</h2>
        <p className="text-gray-600">Manage your profile information and QR code</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><User className="w-4 h-4 mr-2"/>Name</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.name} onChange={(e) => handleUpdate({ name: e.target.value })}/>
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
                <label className="block text-sm text-gray-600 mb-1">Current Stock (kg)</label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.stockKg} onChange={(e) => handleUpdate({ stockKg: Number(e.target.value || 0) })}/>
              </div>
            </div>
          </div>

          {/* Crops */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crops Grown</h3>
            <div className="flex flex-wrap gap-2">
              {profile.crops.map((c, idx) => (
                <span key={idx} className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <Sprout className="w-4 h-4 mr-1"/>{c}
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
            <p className="text-xs text-gray-500 mt-2">Share this QR for others to view your profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;