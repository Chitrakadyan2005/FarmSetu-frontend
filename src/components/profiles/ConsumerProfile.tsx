import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'react-qr-code';
import { Download, QrCode, User, MapPin, Phone, ShoppingBag, MessageSquare, Scan, Star, Calendar, Truck, Leaf } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface PurchaseItem {
  id: string;
  product: string;
  purchasedAt: string;
  batchId: string;
  journey: any[];
  feedback?: string;
  rating?: number;
}

interface ConsumerProfileData {
  name: string;
  location: string;
  contact: string;
  purchases: PurchaseItem[];
  preferences: string[];
}

const ConsumerProfile: React.FC = () => {
  const { user } = useApp();
  const [profile, setProfile] = useState<ConsumerProfileData>({
    name: user?.name || '',
    location: 'Oregon, USA',
    contact: '+1 555-0404',
    purchases: [
      {
        id: 'P001',
        product: 'Organic Tomatoes',
        purchasedAt: '2024-01-18',
        batchId: 'FB001',
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
          },
          {
            stage: 'Retail Store',
            handler: 'FreshMart Retail',
            location: 'Oregon, USA',
            timestamp: '2024-01-17',
            details: 'Available for consumer purchase'
          }
        ],
        feedback: 'Excellent quality, very fresh!',
        rating: 5
      }
    ],
    preferences: ['Organic', 'Local Produce']
  });

  const [qrSeed, setQrSeed] = useState<string>(uuidv4());
  const [showScanModal, setShowScanModal] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState<PurchaseItem | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState<PurchaseItem | null>(null);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

  const [feedbackForm, setFeedbackForm] = useState({
    feedback: '',
    rating: 5
  });

  const qrValue = useMemo(() => (
    JSON.stringify({
      type: 'consumer-profile',
      userId: user?.id,
      seed: qrSeed,
      data: {
        name: profile.name,
        location: profile.location,
        preferences: profile.preferences,
        totalPurchases: profile.purchases.length
      }
    })
  ), [qrSeed, user?.id, profile]);

  const handleUpdate = (updates: Partial<ConsumerProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setQrSeed(uuidv4());
  };

  const addPurchase = (batchData: any) => {
    const newPurchase: PurchaseItem = {
      id: `P${String(profile.purchases.length + 1).padStart(3, '0')}`,
      product: batchData.data?.cropType || 'Unknown Product',
      purchasedAt: new Date().toISOString().split('T')[0],
      batchId: batchData.batchId || batchData.originalBatchId || 'Unknown',
      journey: batchData.data?.journey || []
    };
    
    setProfile(prev => ({ ...prev, purchases: [newPurchase, ...prev.purchases] }));
  };

  const handleScan = () => {
    try {
      const data = JSON.parse(scanInput);
      setScanResult(data);
      
      // If it's a batch QR, automatically add to purchase history
      if (data.type === 'farmer-batch' || data.type === 'distributor-batch') {
        addPurchase(data);
      }
    } catch (e) {
      setScanResult({ error: 'Invalid QR code format' });
    }
  };

  const submitFeedback = (purchaseId: string) => {
    setProfile(prev => ({
      ...prev,
      purchases: prev.purchases.map(p => 
        p.id === purchaseId 
          ? { ...p, feedback: feedbackForm.feedback, rating: feedbackForm.rating }
          : p
      )
    }));
    setShowFeedbackModal(null);
    setFeedbackForm({ feedback: '', rating: 5 });
  };

  const getJourneyIcon = (stage: string) => {
    if (stage.toLowerCase().includes('farm')) return <Leaf className="w-4 h-4 text-green-600" />;
    if (stage.toLowerCase().includes('distribution')) return <Truck className="w-4 h-4 text-blue-600" />;
    if (stage.toLowerCase().includes('retail')) return <ShoppingBag className="w-4 h-4 text-purple-600" />;
    return <Calendar className="w-4 h-4 text-gray-600" />;
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
        <p className="text-gray-600">Track your purchases, view food journeys, and provide feedback</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
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

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {profile.preferences.map((pref, idx) => (
                <span key={idx} className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {pref}
                </span>
              ))}
            </div>
          </div>

          {/* Purchase History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2"/>Purchase History
            </h3>
            
            <div className="space-y-4">
              {profile.purchases.map((purchase) => (
                <div key={purchase.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{purchase.product}</h4>
                      <p className="text-sm text-gray-600">Batch: {purchase.batchId} | Purchased: {purchase.purchasedAt}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowJourneyModal(purchase)} className="text-blue-600 hover:text-blue-700 text-sm">
                        View Journey
                      </button>
                      <button onClick={() => setShowFeedbackModal(purchase)} className="text-green-600 hover:text-green-700 text-sm">
                        {purchase.feedback ? 'Edit Feedback' : 'Add Feedback'}
                      </button>
                    </div>
                  </div>
                  
                  {purchase.feedback && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-4 h-4 ${star <= (purchase.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({purchase.rating}/5)</span>
                      </div>
                      <p className="text-sm text-gray-700">{purchase.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {profile.purchases.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No purchases yet. Scan a product QR to add one.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setShowScanModal(true)} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Scan className="w-5 h-5 text-purple-600 mr-3"/>
                <span className="font-medium">Scan Product QR</span>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <MessageSquare className="w-5 h-5 text-green-600 mr-3"/>
                <span className="font-medium">View All Feedback</span>
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
              <button onClick={handleDownloadQR} className="inline-flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg text-sm">
                <Download className="w-4 h-4 mr-1"/>Download QR
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share this QR for loyalty programs or feedback collection</p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Purchases</span>
                <span className="font-semibold">{profile.purchases.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Feedback Given</span>
                <span className="font-semibold">{profile.purchases.filter(p => p.feedback).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Rating</span>
                <span className="font-semibold">
                  {profile.purchases.filter(p => p.rating).length > 0 
                    ? (profile.purchases.reduce((sum, p) => sum + (p.rating || 0), 0) / profile.purchases.filter(p => p.rating).length).toFixed(1)
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan QR Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Scan Product QR</h3>
            <div className="space-y-4">
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={4} value={scanInput} onChange={(e) => setScanInput(e.target.value)} placeholder="Paste product QR code content here..."/>
              <button onClick={handleScan} className="w-full bg-blue-600 text-white py-2 rounded-lg">Scan Product</button>
              
              {scanResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Scan Result:</h4>
                  {scanResult.error ? (
                    <p className="text-red-600">{scanResult.error}</p>
                  ) : (
                    <div>
                      <p className="text-green-600 mb-2">✓ Product added to purchase history!</p>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">{JSON.stringify(scanResult, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
              
              <button onClick={() => {setShowScanModal(false); setScanResult(null); setScanInput('');}} className="w-full border border-gray-300 py-2 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Journey Modal */}
      {showJourneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Farm-to-Fork Journey: {showJourneyModal.product}</h3>
            
            <div className="space-y-4">
              {showJourneyModal.journey.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    {getJourneyIcon(step.stage)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{step.stage}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(step.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{step.handler}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {step.location}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{step.details}</p>
                  </div>
                  {index < showJourneyModal.journey.length - 1 && (
                    <div className="absolute left-5 mt-10 w-0.5 h-8 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
            
            <button onClick={() => setShowJourneyModal(null)} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Feedback: {showFeedbackModal.product}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                      className={`w-8 h-8 ${star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                  rows={3} 
                  value={feedbackForm.feedback} 
                  onChange={(e) => setFeedbackForm({...feedbackForm, feedback: e.target.value})}
                  placeholder="Share your experience with this product..."
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => submitFeedback(showFeedbackModal.id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Submit Feedback</button>
                <button onClick={() => setShowFeedbackModal(null)} className="flex-1 border border-gray-300 py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerProfile;