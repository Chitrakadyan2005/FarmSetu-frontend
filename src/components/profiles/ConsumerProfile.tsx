import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'react-qr-code';
import { Download, QrCode, User, MapPin, Phone, ShoppingBag, MessageSquare, Scan } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface PurchaseItem {
  id: string;
  product: string;
  purchasedAt: string;
  sourceFarmer?: string;
  sourceDistributor?: string;
  productQRSeed: string;
}

interface ConsumerProfileData {
  name: string;
  location: string;
  contact: string;
  purchases: PurchaseItem[];
  feedback: string;
}

const ConsumerProfile: React.FC = () => {
  const { user } = useApp();
  const [profile, setProfile] = useState<ConsumerProfileData>({
    name: user?.name || '',
    location: 'Oregon, USA',
    contact: '+1 555-0404',
    purchases: [],
    feedback: ''
  });

  const [qrSeed, setQrSeed] = useState<string>(uuidv4());
  const qrValue = useMemo(() => (
    JSON.stringify({ type: 'consumer-profile', userId: user?.id, seed: qrSeed, data: { name: profile.name } })
  ), [qrSeed, user?.id, profile.name]);

  const handleUpdate = (updates: Partial<ConsumerProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setQrSeed(uuidv4());
  };

  const [scanInput, setScanInput] = useState('');

  const simulateScan = () => {
    // In a real app, decode QR content. Here, treat input as JSON and extract a mock source
    try {
      const data = JSON.parse(scanInput);
      const newPurchase: PurchaseItem = {
        id: String(profile.purchases.length + 1),
        product: data?.data?.cropType || data?.product || 'Produce',
        purchasedAt: new Date().toISOString(),
        sourceFarmer: data?.data?.farmerName || 'Unknown Farmer',
        sourceDistributor: data?.data?.currentOwner || 'Unknown Distributor',
        productQRSeed: uuidv4(),
      };
      setProfile(prev => ({ ...prev, purchases: [newPurchase, ...prev.purchases] }));
      setQrSeed(uuidv4());
      setScanInput('');
    } catch (e) {
      alert('Invalid QR content. Paste valid JSON payload.');
    }
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
      a.download = `consumer-profile-${user?.id}.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Consumer Profile</h2>
        <p className="text-gray-600">View your history, scan products, and leave feedback</p>
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
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><MapPin className="w-4 h-4 mr-2"/>Location</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.location} onChange={(e) => handleUpdate({ location: e.target.value })}/>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><Phone className="w-4 h-4 mr-2"/>Contact</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.contact} onChange={(e) => handleUpdate({ contact: e.target.value })}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Scan className="w-4 h-4 mr-2"/>Scan Product QR</h3>
            <div className="flex gap-2 mb-3">
              <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2" placeholder='Paste product QR JSON here (e.g., {"data":{"cropType":"Tomatoes","farmerName":"John Farmer","currentOwner":"Green Valley Distributors"}})' value={scanInput} onChange={(e) => setScanInput(e.target.value)} />
              <button onClick={simulateScan} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Scan</button>
            </div>
            <p className="text-sm text-gray-500">This simulates scanning a product QR, adding it to your purchase history with source info.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><ShoppingBag className="w-4 h-4 mr-2"/>Purchase History</h3>
            <div className="space-y-3">
              {profile.purchases.map((p) => (
                <div key={p.id} className="border rounded-lg p-4">
                  <div className="font-medium text-gray-900">{p.product}</div>
                  <div className="text-sm text-gray-500">Purchased {new Date(p.purchasedAt).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Farmer: {p.sourceFarmer} | Distributor: {p.sourceDistributor}</div>
                </div>
              ))}
              {profile.purchases.length === 0 && (
                <div className="text-sm text-gray-500">No purchases yet. Scan a product QR to add one.</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><MessageSquare className="w-4 h-4 mr-2"/>Feedback</h3>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} value={profile.feedback} onChange={(e) => handleUpdate({ feedback: e.target.value })} placeholder="Share your feedback about product quality or experience" />
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
            <p className="text-xs text-gray-500 mt-2">Profile QR refreshes when details, purchases or feedback change.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerProfile;