import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'react-qr-code';
import { Download, QrCode, User, MapPin, Phone, Store, Package, Users, ClipboardCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface DistributorProfileData {
  name: string;
  businessName: string;
  location: string;
  contact: string;
  produceHandled: string[];
  stockUnits: number; // units in stock
  connectedFarmers: string[];
}

const DistributorProfile: React.FC = () => {
  const { user } = useApp();
  const [profile, setProfile] = useState<DistributorProfileData>({
    name: user?.name || '',
    businessName: 'Green Valley Distributors',
    location: 'Nevada, USA',
    contact: '+1 555-0202',
    produceHandled: ['Tomatoes', 'Carrots'],
    stockUnits: 320,
    connectedFarmers: ['John Farmer']
  });

  const [qrSeed, setQrSeed] = useState<string>(uuidv4());
  const qrValue = useMemo(() => (
    JSON.stringify({
      type: 'distributor-profile',
      userId: user?.id,
      seed: qrSeed,
      data: {
        name: profile.name,
        businessName: profile.businessName,
        location: profile.location,
        stockUnits: profile.stockUnits,
      }
    })
  ), [qrSeed, user?.id, profile]);

  const handleUpdate = (updates: Partial<DistributorProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setQrSeed(uuidv4());
  };

  const [newProduce, setNewProduce] = useState('');
  const [newFarmer, setNewFarmer] = useState('');

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
      a.download = `distributor-profile-${user?.id}.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Distributor Profile</h2>
        <p className="text-gray-600">Manage your details, inventory, and connections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><User className="w-4 h-4 mr-2"/>Name</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.name} onChange={(e) => handleUpdate({ name: e.target.value })}/>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><Store className="w-4 h-4 mr-2"/>Business Name</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.businessName} onChange={(e) => handleUpdate({ businessName: e.target.value })}/>
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

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Produce Handled</h3>
            <div className="flex gap-2 mb-4">
              <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2" placeholder="Add produce" value={newProduce} onChange={(e) => setNewProduce(e.target.value)} />
              <button onClick={() => { if (!newProduce.trim()) return; handleUpdate({ produceHandled: [...profile.produceHandled, newProduce.trim()] }); setNewProduce(''); }} className="px-4 py-2 bg-green-600 text-white rounded-lg">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.produceHandled.map((p, idx) => (
                <span key={idx} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"><Package className="w-4 h-4 mr-1"/>{p}</span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Farmers</h3>
            <div className="flex gap-2 mb-4">
              <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2" placeholder="Farmer name" value={newFarmer} onChange={(e) => setNewFarmer(e.target.value)} />
              <button onClick={() => { if (!newFarmer.trim()) return; handleUpdate({ connectedFarmers: [...profile.connectedFarmers, newFarmer.trim()] }); setNewFarmer(''); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Connect</button>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {profile.connectedFarmers.map((f, idx) => (
                <li key={idx} className="flex items-center"><Users className="w-4 h-4 mr-2 text-blue-600"/>{f}</li>
              ))}
            </ul>

            <div className="mt-4">
              <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg"><ClipboardCheck className="w-4 h-4 mr-2"/>Accept Retailer Demand</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6" ref={downloadRef}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><QrCode className="w-5 h-5 mr-2"/>View QR Code</h3>
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCode value={qrValue} size={180} />
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleDownloadQR} className="inline-flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"><Download className="w-4 h-4 mr-1"/>Download QR</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">QR refreshes whenever you update details, stock, produce or connections.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorProfile;