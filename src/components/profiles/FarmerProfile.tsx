import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'react-qr-code';
import { Download, QrCode, User, MapPin, Phone, Sprout, Package, Link2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Simple in-memory profile state for demo; in a real app this may come from API/context
interface FarmerProfileData {
  name: string;
  location: string;
  contact: string;
  crops: string[];        // list of crops grown
  stockKg: number;        // current stock in kg
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
    // Generate new QR each update
    setQrSeed(uuidv4());
  };

  const [newCrop, setNewCrop] = useState('');
  const [newDistributor, setNewDistributor] = useState('');

  const downloadRef = useRef<HTMLDivElement>(null);
  const handleDownloadQR = () => {
    // Convert the SVG QR to a downloadable PNG
    const svg = downloadRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const scale = 2; // improve quality
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
        <p className="text-gray-600">Manage your details, crops, and stock</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Details and editable info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><User className="w-4 h-4 mr-2"/>Name</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={profile.name}
                  onChange={(e) => handleUpdate({ name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><MapPin className="w-4 h-4 mr-2"/>Location</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={profile.location}
                  onChange={(e) => handleUpdate({ location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><Phone className="w-4 h-4 mr-2"/>Contact</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={profile.contact}
                  onChange={(e) => handleUpdate({ contact: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><Package className="w-4 h-4 mr-2"/>Current Stock (kg)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={profile.stockKg}
                  onChange={(e) => handleUpdate({ stockKg: Number(e.target.value || 0) })}
                />
              </div>
            </div>
          </div>

          {/* Crops & connections */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crops Grown</h3>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Add crop"
                value={newCrop}
                onChange={(e) => setNewCrop(e.target.value)}
              />
              <button
                onClick={() => {
                  if (!newCrop.trim()) return;
                  handleUpdate({ crops: [...profile.crops, newCrop.trim()] });
                  setNewCrop('');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.crops.map((c, idx) => (
                <span key={idx} className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"><Sprout className="w-4 h-4 mr-1"/>{c}</span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect to Distributors</h3>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Distributor name"
                value={newDistributor}
                onChange={(e) => setNewDistributor(e.target.value)}
              />
              <button
                onClick={() => {
                  if (!newDistributor.trim()) return;
                  handleUpdate({ connectedDistributors: [...profile.connectedDistributors, newDistributor.trim()] });
                  setNewDistributor('');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >Connect</button>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {profile.connectedDistributors.map((d, idx) => (
                <li key={idx} className="flex items-center"><Link2 className="w-4 h-4 mr-2 text-blue-600"/>{d}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column: QR */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6" ref={downloadRef}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><QrCode className="w-5 h-5 mr-2"/>View QR Code</h3>
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCode value={qrValue} size={180} />
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleDownloadQR} className="inline-flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"><Download className="w-4 h-4 mr-1"/>Download QR</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">QR refreshes whenever you update profile, crops, stock, or connections.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;