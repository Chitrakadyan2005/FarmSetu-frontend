import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'react-qr-code';
import { Download, QrCode, User, MapPin, Phone, Sprout, Package, Link2, Plus, Eye, Send, Scan } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FarmerProfileData {
  name: string;
  location: string;
  contact: string;
  crops: string[];
  stockKg: number;
  connectedDistributors: string[];
}

interface BatchItem {
  id: string;
  cropType: string;
  harvestDate: string;
  quantity: number;
  storageCondition: string;
  qrSeed: string;
  status: 'available' | 'forwarded';
  forwardedTo?: string;
}

const FarmerProfile: React.FC = () => {
  const { user, batches } = useApp();
  const [profile, setProfile] = useState<FarmerProfileData>({
    name: user?.name || '',
    location: 'California, USA',
    contact: '+1 555-0101',
    crops: ['Tomatoes', 'Carrots'],
    stockKg: 120,
    connectedDistributors: ['Green Valley Distributors']
  });

  const [myBatches, setMyBatches] = useState<BatchItem[]>([
    {
      id: 'FB001',
      cropType: 'Organic Tomatoes',
      harvestDate: '2024-01-15',
      quantity: 100,
      storageCondition: 'Cold Storage',
      qrSeed: uuidv4(),
      status: 'available'
    }
  ]);

  const [qrSeed, setQrSeed] = useState<string>(uuidv4());
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [showQRModal, setShowQRModal] = useState<BatchItem | null>(null);
  const [showForwardModal, setShowForwardModal] = useState<BatchItem | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

  const [newBatch, setNewBatch] = useState({
    cropType: '',
    harvestDate: '',
    quantity: '',
    storageCondition: ''
  });

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

  const addBatch = () => {
    if (!newBatch.cropType || !newBatch.harvestDate || !newBatch.quantity) return;
    
    const batch: BatchItem = {
      id: `FB${String(myBatches.length + 1).padStart(3, '0')}`,
      cropType: newBatch.cropType,
      harvestDate: newBatch.harvestDate,
      quantity: Number(newBatch.quantity),
      storageCondition: newBatch.storageCondition,
      qrSeed: uuidv4(),
      status: 'available'
    };
    
    setMyBatches(prev => [...prev, batch]);
    setNewBatch({ cropType: '', harvestDate: '', quantity: '', storageCondition: '' });
    setShowAddBatch(false);
  };

  const forwardBatch = (batchId: string, distributorName: string) => {
    setMyBatches(prev => prev.map(batch => 
      batch.id === batchId 
        ? { ...batch, status: 'forwarded' as const, forwardedTo: distributorName }
        : batch
    ));
    setShowForwardModal(null);
  };

  const handleScan = () => {
    try {
      const data = JSON.parse(scanInput);
      setScanResult(data);
    } catch (e) {
      setScanResult({ error: 'Invalid QR code format' });
    }
  };

  const getBatchQRValue = (batch: BatchItem) => {
    return JSON.stringify({
      type: 'farmer-batch',
      batchId: batch.id,
      farmerId: user?.id,
      farmerName: profile.name,
      seed: batch.qrSeed,
      data: {
        cropType: batch.cropType,
        harvestDate: batch.harvestDate,
        quantity: batch.quantity,
        storageCondition: batch.storageCondition,
        farmerLocation: profile.location,
        farmerContact: profile.contact,
        journey: [
          {
            stage: 'Farm Origin',
            handler: profile.name,
            location: profile.location,
            timestamp: batch.harvestDate,
            details: `Harvested ${batch.quantity}kg of ${batch.cropType}`
          }
        ]
      }
    });
  };

  const downloadRef = useRef<HTMLDivElement>(null);
  const handleDownloadQR = (isProfile = true, batch?: BatchItem) => {
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
      a.download = isProfile ? `farmer-profile-${user?.id}.png` : `batch-${batch?.id}.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Farmer Profile</h2>
        <p className="text-gray-600">Manage your details, crops, batches, and QR connections</p>
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
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><Package className="w-4 h-4 mr-2"/>Current Stock (kg)</label>
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

          {/* My Batches */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">My Batches</h3>
              <button onClick={() => setShowAddBatch(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="w-4 h-4 mr-2"/>Add Batch
              </button>
            </div>
            
            <div className="space-y-3">
              {myBatches.map((batch) => (
                <div key={batch.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{batch.cropType}</h4>
                      <p className="text-sm text-gray-600">ID: {batch.id} | {batch.quantity}kg | {batch.harvestDate}</p>
                      <p className="text-sm text-gray-500">Storage: {batch.storageCondition}</p>
                      {batch.status === 'forwarded' && (
                        <p className="text-sm text-blue-600">Forwarded to: {batch.forwardedTo}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowQRModal(batch)} className="text-blue-600 hover:text-blue-700 flex items-center">
                        <Eye className="w-4 h-4 mr-1"/>View QR
                      </button>
                      {batch.status === 'available' && (
                        <button onClick={() => setShowForwardModal(batch)} className="text-green-600 hover:text-green-700 flex items-center">
                          <Send className="w-4 h-4 mr-1"/>Forward
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setShowScanModal(true)} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Scan className="w-5 h-5 text-purple-600 mr-3"/>
                <span className="font-medium">Scan QR Code</span>
              </button>
              <button onClick={() => setShowAddBatch(true)} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Plus className="w-5 h-5 text-green-600 mr-3"/>
                <span className="font-medium">Add New Batch</span>
              </button>
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
              <button onClick={() => handleDownloadQR(true)} className="inline-flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg text-sm">
                <Download className="w-4 h-4 mr-1"/>Download QR
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share this QR for others to view your profile</p>
          </div>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Batch</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={newBatch.cropType} onChange={(e) => setNewBatch({...newBatch, cropType: e.target.value})} placeholder="e.g., Organic Tomatoes"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={newBatch.harvestDate} onChange={(e) => setNewBatch({...newBatch, harvestDate: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={newBatch.quantity} onChange={(e) => setNewBatch({...newBatch, quantity: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Condition</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2" value={newBatch.storageCondition} onChange={(e) => setNewBatch({...newBatch, storageCondition: e.target.value})}>
                  <option value="">Select condition</option>
                  <option value="Cold Storage">Cold Storage</option>
                  <option value="Room Temperature">Room Temperature</option>
                  <option value="Controlled Atmosphere">Controlled Atmosphere</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={addBatch} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Add Batch</button>
                <button onClick={() => setShowAddBatch(false)} className="flex-1 border border-gray-300 py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6" ref={downloadRef}>
            <h3 className="text-lg font-semibold mb-4">Batch QR Code - {showQRModal.id}</h3>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block">
                <QRCode value={getBatchQRValue(showQRModal)} size={200} />
              </div>
              <div className="mt-4 space-y-2">
                <button onClick={() => handleDownloadQR(false, showQRModal)} className="w-full bg-gray-800 text-white py-2 rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2"/>Download Batch QR
                </button>
                <button onClick={() => setShowQRModal(null)} className="w-full border border-gray-300 py-2 rounded-lg">Close</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Share this QR with distributors to transfer batch</p>
            </div>
          </div>
        </div>
      )}

      {/* Forward Batch Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Forward Batch - {showForwardModal.id}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Distributor</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2" onChange={(e) => e.target.value && forwardBatch(showForwardModal.id, e.target.value)}>
                  <option value="">Choose distributor...</option>
                  {profile.connectedDistributors.map((dist, idx) => (
                    <option key={idx} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowForwardModal(null)} className="flex-1 border border-gray-300 py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan QR Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
            <div className="space-y-4">
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={4} value={scanInput} onChange={(e) => setScanInput(e.target.value)} placeholder="Paste QR code content here..."/>
              <button onClick={handleScan} className="w-full bg-blue-600 text-white py-2 rounded-lg">Scan</button>
              
              {scanResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Scan Result:</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(scanResult, null, 2)}</pre>
                </div>
              )}
              
              <button onClick={() => {setShowScanModal(false); setScanResult(null); setScanInput('');}} className="w-full border border-gray-300 py-2 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;