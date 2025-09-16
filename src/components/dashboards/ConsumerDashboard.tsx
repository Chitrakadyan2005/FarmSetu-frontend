import React, { useState } from 'react';
import { QrCode, Search, Shield, MapPin, Calendar, DollarSign, ArrowRight, Scan, ShoppingCart, Star, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProduceBatch } from '../../types';

interface ConsumerDashboardProps {
  currentPage: string;
}

interface Purchase {
  id: string;
  batchId: string;
  product: string;
  quantity: number;
  price: number;
  date: string;
  location: string;
  journey: any[];
  feedback?: string;
  rating?: number;
}

const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({ currentPage }) => {
  const { getBatchById } = useApp();
  const [scanInput, setScanInput] = useState('');
  const [scannedBatch, setScannedBatch] = useState<ProduceBatch | null>(null);
  const [scanResult, setScanResult] = useState<'found' | 'not-found' | null>(null);
  const [showBuyForm, setShowBuyForm] = useState<any>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [showJourneyModal, setShowJourneyModal] = useState<Purchase | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  
  const [buyForm, setBuyForm] = useState({
    quantity: '',
    price: ''
  });

  const handleScan = () => {
    if (scanInput.trim()) {
      const batch = getBatchById(scanInput.trim().toUpperCase());
      if (batch) {
        setScannedBatch(batch);
        setScanResult('found');
      } else {
        // Try parsing as QR JSON
        try {
          const data = JSON.parse(scanInput);
          if (data.type === 'farmer-batch' || data.type === 'distributor-batch') {
            setScannedBatch(data.data);
            setScanResult('found');
            // Show buy form
            setShowBuyForm({
              ...data,
              buyerName: 'Sarah Consumer',
              buyerProfession: 'Consumer',
              date: new Date().toISOString().split('T')[0],
              location: 'Oregon, USA'
            });
          } else {
            setScanResult('not-found');
          }
        } catch {
          setScannedBatch(null);
          setScanResult('not-found');
        }
      }
    }
  };

  const handleBuy = () => {
    if (!buyForm.quantity || !buyForm.price) return;
    
    const purchase: Purchase = {
      id: `P${Date.now()}`,
      batchId: showBuyForm.batchId,
      product: showBuyForm.data?.cropType || 'Unknown Product',
      quantity: Number(buyForm.quantity),
      price: Number(buyForm.price),
      date: showBuyForm.date,
      location: showBuyForm.location,
      journey: showBuyForm.data?.journey || []
    };
    
    setPurchases(prev => [purchase, ...prev]);
    setShowBuyForm(null);
    setBuyForm({ quantity: '', price: '' });
    
    // Simulate blockchain entry
    console.log('Blockchain entry created:', purchase);
  };

  const getJourneySteps = (batch: ProduceBatch) => {
    const steps = [
      {
        title: 'Farm Origin',
        description: batch.farmerName,
        location: batch.location,
        date: batch.harvestDate,
        icon: '🌱',
        status: 'completed'
      }
    ];

    batch.transfers?.forEach((transfer, index) => {
      steps.push({
        title: `Transfer ${index + 1}`,
        description: transfer.to,
        location: transfer.location,
        date: transfer.timestamp,
        icon: index === batch.transfers.length - 1 ? '🏪' : '🚚',
        status: 'completed'
      });
    });

    return steps;
  };

  const openCamera = () => {
    setShowCamera(true);
    // In a real app, this would open the device camera
    // For demo purposes, we'll simulate camera opening
    setTimeout(() => {
      alert('Camera would open here in a real app. For demo, please use the input field.');
      setShowCamera(false);
    }, 1000);
  };

  if (currentPage === 'scanner') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Scanner</h2>
          <p className="text-gray-600">Scan products to view their journey and make purchases</p>
        </div>

        {/* Scanner */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col items-center">
            {showCamera ? (
              <div className="w-64 h-64 bg-black rounded-lg flex items-center justify-center mb-6">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p>Opening Camera...</p>
                </div>
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">QR Scanner Viewport</p>
                  <p className="text-sm text-gray-500">Click scan to open camera</p>
                </div>
              </div>
            )}

            <div className="w-full max-w-md space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={openCamera}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan QR
                </button>
                <span className="flex items-center text-gray-500 px-3">OR</span>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Type Batch ID or paste QR content"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={handleScan}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Results */}
        {scanResult === 'not-found' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
            <p className="text-red-800 font-medium">Product not found</p>
            <p className="text-red-600 text-sm">Please check the code and try again</p>
          </div>
        )}

        {scannedBatch && scanResult === 'found' && (
          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{scannedBatch.cropType}</h3>
                  <p className="text-gray-600">Batch ID: {scannedBatch.id}</p>
                </div>
                <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Verified Authentic</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Harvest Date</p>
                  <p className="font-semibold">{new Date(scannedBatch.harvestDate).toLocaleDateString()}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Origin</p>
                  <p className="font-semibold">{scannedBatch.location}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Farm Price</p>
                  <p className="font-semibold">${scannedBatch.price}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Quality</p>
                  <p className="font-semibold text-green-600">Grade A</p>
                </div>
              </div>

              {showBuyForm && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <button
                    onClick={() => setShowBuyForm({
                      ...showBuyForm,
                      buyerName: 'Sarah Consumer',
                      buyerProfession: 'Consumer',
                      date: new Date().toISOString().split('T')[0],
                      location: 'Oregon, USA'
                    })}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy This Product
                  </button>
                </div>
              )}
            </div>

            {/* Journey Timeline */}
            {scannedBatch.transfers && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Supply Chain Journey</h4>
                
                <div className="space-y-4">
                  {getJourneySteps(scannedBatch).map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg mr-4">
                        {step.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-gray-900">{step.title}</h5>
                          <span className="text-sm text-gray-500">
                            {new Date(step.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {step.location}
                        </p>
                      </div>
                      {index < getJourneySteps(scannedBatch).length - 1 && (
                        <ArrowRight className="w-5 h-5 text-gray-400 ml-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Purchase History */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase History</h3>
          
          {purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{purchase.product}</h4>
                      <p className="text-sm text-gray-600">
                        Batch: {purchase.batchId} | {purchase.quantity}kg | ${purchase.price}
                      </p>
                      <p className="text-sm text-gray-500">Purchased: {purchase.date}</p>
                    </div>
                    <button
                      onClick={() => setShowJourneyModal(purchase)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      View Journey
                    </button>
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
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No purchases yet. Scan a product QR to make your first purchase.</p>
            </div>
          )}
        </div>

        {/* Buy Form Modal */}
        {showBuyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Purchase Form</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Name</label>
                    <input 
                      type="text" 
                      value={showBuyForm.buyerName} 
                      disabled 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                    <input 
                      type="text" 
                      value={showBuyForm.buyerProfession} 
                      disabled 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                      type="date" 
                      value={showBuyForm.date} 
                      disabled 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <input 
                      type="text" 
                      value={showBuyForm.data?.cropType || scannedBatch?.cropType || 'Unknown'} 
                      disabled 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={showBuyForm.location} 
                    disabled 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                    <input 
                      type="number" 
                      value={buyForm.quantity}
                      onChange={(e) => setBuyForm({...buyForm, quantity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={buyForm.price}
                      onChange={(e) => setBuyForm({...buyForm, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter price"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleBuy}
                    disabled={!buyForm.quantity || !buyForm.price}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Complete Purchase
                  </button>
                  <button 
                    onClick={() => setShowBuyForm(null)}
                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
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
                {showJourneyModal.journey.map((step: any, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      {step.stage?.toLowerCase().includes('farm') ? '🌱' : 
                       step.stage?.toLowerCase().includes('distribution') ? '🚚' : '🏪'}
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
                  </div>
                ))}
              </div>
              
              <button onClick={() => setShowJourneyModal(null)} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg">Close</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Consumer Dashboard</h2>
        <p className="text-gray-600">Discover the story behind your food</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Products</p>
              <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {purchases.filter(p => p.rating).length > 0 
                  ? (purchases.reduce((sum, p) => sum + (p.rating || 0), 0) / purchases.filter(p => p.rating).length).toFixed(1)
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Scan className="w-5 h-5 mr-2" />
          Product Scanner
        </h3>
        <div className="flex space-x-2 items-center">
          <button
            onClick={openCamera}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center"
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan QR
          </button>
          <span className="text-gray-500">OR</span>
          <input
            type="text"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Type Batch ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={handleScan}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <QrCode className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Product Scanner</h3>
          </div>
          <p className="text-gray-600">Scan QR codes on food packages to trace their complete journey and make purchases.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Authenticity</h3>
          </div>
          <p className="text-gray-600">Verify the authenticity and quality of organic and premium food products.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Origin Tracking</h3>
          </div>
          <p className="text-gray-600">Know exactly where your food comes from and how it reached your table.</p>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;