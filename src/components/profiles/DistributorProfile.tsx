import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'react-qr-code';
import { Download, QrCode, User, MapPin, Phone, Store, Package, Users, Eye, Send, Scan, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface DistributorProfileData {
  name: string;
  businessName: string;
  location: string;
  contact: string;
  produceHandled: string[];
  stockUnits: number;
  connectedFarmers: string[];
}

interface ReceivedBatch {
  id: string;
  originalBatchId: string;
  cropType: string;
  quantity: number;
  receivedFrom: string;
  receivedDate: string;
  qrSeed: string;
  status: 'received' | 'forwarded';
  forwardedTo?: string;
  journey: any[];
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

  const [receivedBatches, setReceivedBatches] = useState<ReceivedBatch[]>([
    {
      id: 'DB001',
      originalBatchId: 'FB001',
      cropType: 'Organic Tomatoes',
      quantity: 100,
      receivedFrom: 'John Farmer',
      receivedDate: '2024-01-16',
      qrSeed: uuidv4(),
      status: 'received',
      journey: [
        {
          stage: 'Farm Origin',
          handler: 'John Farmer',
          location: 'California, USA',
          timestamp: '2024-01-15',
          details: 'Harvested 100kg of Organic Tomatoes'
        },
        {
          stage: 'Distribution Center',
          handler: 'Green Valley Distributors',
          location: 'Nevada, USA',
          timestamp: '2024-01-16',
          details: 'Received and processed for distribution'
        }
      ]
    }
  ]);

  const [qrSeed, setQrSeed] = useState<string>(uuidv4());
  const [showQRModal, setShowQRModal] = useState<ReceivedBatch | null>(null);
  const [showForwardModal, setShowForwardModal] = useState<ReceivedBatch | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

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

  const receiveBatch = (farmerBatchData: any) => {
    const newBatch: ReceivedBatch = {
      id: `DB${String(receivedBatches.length + 1).padStart(3, '0')}`,
      originalBatchId: farmerBatchData.batchId,
      cropType: farmerBatchData.data.cropType,
      quantity: farmerBatchData.data.quantity,
      receivedFrom: farmerBatchData.farmerName,
      receivedDate: new Date().toISOString().split('T')[0],
      qrSeed: uuidv4(),
      status: 'received',
      journey: [
        ...farmerBatchData.data.journey,
        {
          stage: 'Distribution Center',
          handler: profile.businessName,
          location: profile.location,
          timestamp: new Date().toISOString(),
          details: `Received ${farmerBatchData.data.quantity}kg from ${farmerBatchData.farmerName}`
        }
      ]
    };
    
    setReceivedBatches(prev => [...prev, newBatch]);
  };

  const forwardBatch = (batchId: string, retailerName: string) => {
    setReceivedBatches(prev => prev.map(batch => {
      if (batch.id === batchId) {
        const updatedJourney = [
          ...batch.journey,
          {
            stage: 'Retail/Consumer',
            handler: retailerName,
            location: 'Various Locations',
            timestamp: new Date().toISOString(),
            details: `Forwarded to ${retailerName} for retail distribution`
          }
        ];
        return { 
          ...batch, 
          status: 'forwarded' as const, 
          forwardedTo: retailerName,
          journey: updatedJourney
        };
      }
      return batch;
    }));
    setShowForwardModal(null);
  };

  const handleScan = () => {
    try {
      const data = JSON.parse(scanInput);
      setScanResult(data);
      
      // If it's a farmer batch, automatically receive it
      if (data.type === 'farmer-batch') {
        receiveBatch(data);
      }
    } catch (e) {
      setScanResult({ error: 'Invalid QR code format' });
    }
  };

  const getBatchQRValue = (batch: ReceivedBatch) => {
    return JSON.stringify({
      type: 'distributor-batch',
      batchId: batch.id,
      originalBatchId: batch.originalBatchId,
      distributorId: user?.id,
      distributorName: profile.businessName,
      seed: batch.qrSeed,
      data: {
        cropType: batch.cropType,
        quantity: batch.quantity,
        receivedFrom: batch.receivedFrom,
        distributorLocation: profile.location,
        distributorContact: profile.contact,
        journey: batch.journey
      }
    });
  };

  const downloadRef = useRef<HTMLDivElement>(null);
  const handleDownloadQR = (isProfile = true, batch?: ReceivedBatch) => {
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
      a.download = isProfile ? `distributor-profile-${user?.id}.png` : `batch-${batch?.id}.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Distributor Profile</h2>
        <p className="text-gray-600">Manage inventory, receive batches, and track supply chain</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
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

          {/* Received Batches */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Received Batches</h3>
            <div className="space-y-3">
              {receivedBatches.map((batch) => (
                <div key={batch.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{batch.cropType}</h4>
                      <p className="text-sm text-gray-600">ID: {batch.id} | {batch.quantity}kg | From: {batch.receivedFrom}</p>
                      <p className="text-sm text-gray-500">Received: {batch.receivedDate}</p>
                      {batch.status === 'forwarded' && (
                        <p className="text-sm text-blue-600">Forwarded to: {batch.forwardedTo}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowQRModal(batch)} className="text-blue-600 hover:text-blue-700 flex items-center">
                        <Eye className="w-4 h-4 mr-1"/>View QR
                      </button>
                      {batch.status === 'received' && (
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
                <span className="font-medium">Scan QR / Receive Batch</span>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3"/>
                <span className="font-medium">Quality Check</span>
              </button>
            </div>
          </div>

          {/* Connected Farmers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Farmers</h3>
            <div className="flex flex-wrap gap-2">
              {profile.connectedFarmers.map((farmer, idx) => (
                <span key={idx} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Users className="w-4 h-4 mr-1"/>{farmer}
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
              <button onClick={() => handleDownloadQR(true)} className="inline-flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg text-sm">
                <Download className="w-4 h-4 mr-1"/>Download QR
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share this QR for others to view your profile</p>
          </div>
        </div>
      </div>

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
              <p className="text-xs text-gray-500 mt-2">Share this QR with retailers/consumers</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Forward To</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2" onChange={(e) => e.target.value && forwardBatch(showForwardModal.id, e.target.value)}>
                  <option value="">Choose destination...</option>
                  <option value="FreshMart Retail">FreshMart Retail</option>
                  <option value="GreenGrocer Co">GreenGrocer Co</option>
                  <option value="Organic Markets Ltd">Organic Markets Ltd</option>
                  <option value="Consumer Direct">Consumer Direct</option>
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
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={4} value={scanInput} onChange={(e) => setScanInput(e.target.value)} placeholder="Paste farmer's batch QR code content here..."/>
              <button onClick={handleScan} className="w-full bg-blue-600 text-white py-2 rounded-lg">Scan & Receive</button>
              
              {scanResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Scan Result:</h4>
                  {scanResult.error ? (
                    <p className="text-red-600">{scanResult.error}</p>
                  ) : (
                    <div>
                      <p className="text-green-600 mb-2">✓ Batch received successfully!</p>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(scanResult, null, 2)}</pre>
                    </div>
                  )}
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

export default DistributorProfile;