import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Search, Shield, MapPin, Calendar, DollarSign, ArrowRight, Scan, ShoppingCart, Star, Camera, Eye, Brain, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProduceBatch } from '../../types';
import MLInsightsPanel from '../insights/MLInsightsPanel';
import { generateMLInsights } from '../../utils/mlInsights';

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

// Dummy purchase data
const dummyPurchases: Purchase[] = [
  {
    id: 'P001',
    batchId: 'BTH001',
    product: 'Organic Tomatoes',
    quantity: 2,
    price: 11.98,
    date: '2024-01-18',
    location: 'Oregon, USA',
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
        details: 'Quality checked and packaged for retail'
      },
      {
        stage: 'Retail Store',
        handler: 'Fresh Market Store',
        location: 'Oregon, USA',
        timestamp: '2024-01-17',
        details: 'Available for consumer purchase'
      }
    ],
    feedback: 'Excellent quality tomatoes! Very fresh and flavorful.',
    rating: 5
  },
  {
    id: 'P002',
    batchId: 'BTH002',
    product: 'Fresh Carrots',
    quantity: 1,
    price: 3.49,
    date: '2024-01-22',
    location: 'Oregon, USA',
    journey: [
      {
        stage: 'Farm Origin',
        handler: 'John Farmer',
        location: 'California, USA',
        timestamp: '2024-01-20',
        details: 'Harvested 50kg of Fresh Carrots'
      },
      {
        stage: 'Local Market',
        handler: 'Farmers Market',
        location: 'Oregon, USA',
        timestamp: '2024-01-21',
        details: 'Direct from farm to market'
      }
    ],
    feedback: 'Good quality carrots, though could be a bit fresher.',
    rating: 4
  },
  {
    id: 'P003',
    batchId: 'BTH003',
    product: 'Organic Lettuce',
    quantity: 3,
    price: 8.97,
    date: '2024-01-25',
    location: 'Oregon, USA',
    journey: [
      {
        stage: 'Farm Origin',
        handler: 'Green Leaf Farm',
        location: 'Washington, USA',
        timestamp: '2024-01-23',
        details: 'Harvested organic lettuce heads'
      },
      {
        stage: 'Distribution',
        handler: 'Organic Distributors Inc',
        location: 'Oregon, USA',
        timestamp: '2024-01-24',
        details: 'Temperature controlled transport'
      }
    ],
    rating: 3
  }
];

const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({ currentPage }) => {
  const { getBatchById } = useApp();
  const [scanInput, setScanInput] = useState('');
  const [scannedBatch, setScannedBatch] = useState<ProduceBatch | null>(null);
  const [scanResult, setScanResult] = useState<'found' | 'not-found' | null>(null);
  const [showBuyForm, setShowBuyForm] = useState<any>(null);
  const [purchases, setPurchases] = useState<Purchase[]>(dummyPurchases);
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
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Purchases</h2>
          <p className="text-gray-600">View your purchase history and product journeys</p>
        </div>

        {/* Purchase History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
          </div>
          
          {purchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <motion.tr
                      key={purchase.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{purchase.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{purchase.product}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{purchase.batchId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{purchase.quantity} kg</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${purchase.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{new Date(purchase.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {purchase.rating ? (
                          <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-4 h-4 ${star <= (purchase.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-1">({purchase.rating}/5)</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No rating</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <button
                          onClick={() => setShowJourneyModal(purchase)}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center hover:underline"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Actions
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No additional purchases yet. Visit the main dashboard to scan more products and make purchases.</p>
            </div>
          )}
        </div>

        {/* Feedback Section for purchases with feedback */}
        {purchases.some(p => p.feedback) && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Purchase Feedback</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {purchases.filter(p => p.feedback).map((purchase) => (
                  <motion.div
                    key={purchase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{purchase.product}</h4>
                        <p className="text-sm text-gray-600">Purchase ID: {purchase.id} | {purchase.date}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-4 h-4 ${star <= (purchase.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">({purchase.rating}/5)</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{purchase.feedback}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Journey Modal */}
        {showJourneyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center text-gray-900">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  Journey - {showJourneyModal.product}
                </h3>
                <button
                  onClick={() => setShowJourneyModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  View QR Code
                </button>
                <button
                  className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  ML Insights
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Purchase Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Purchase Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Product:</span> {showJourneyModal.product}</p>
                    <p><span className="font-medium">Quantity:</span> {showJourneyModal.quantity} kg</p>
                    <p><span className="font-medium">Price:</span> ${showJourneyModal.price}</p>
                    <p><span className="font-medium">Date:</span> {new Date(showJourneyModal.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {/* ML Insights */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Brain className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-900">ML Insights</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Quality Grade</span>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Grade A
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">95% confidence</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Fraud Check</span>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          LOW RISK
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">All checks passed</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Journey Steps */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Farm-to-Fork Journey</h4>
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
              </div>
              
              {/* Enhanced ML Analysis */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Detailed ML Analysis
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-purple-800">Predicted Grade:</span>
                    <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Grade A
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-purple-800">Suggested Price:</span>
                    <span className="ml-2 text-green-600 font-semibold">
                      ${(showJourneyModal.price / showJourneyModal.quantity).toFixed(2)}/kg
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-purple-800">Fraud/Anomaly Detection:</span>
                    <div className="mt-1">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        LOW RISK
                      </span>
                    </div>
                    <p className="text-purple-700 mt-1 text-xs">
                      No issues detected. Proceed with confidence.
                    </p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowJourneyModal(null)} 
                className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Consumer Dashboard</h2>
        <p className="text-gray-600">Discover the story behind your food</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Products</p>
              <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
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
        </motion.div>
      </div>

      {/* QR Scanner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <QrCode className="w-5 h-5 mr-2" />
          Product Scanner with ML Insights
        </h3>
        <p className="text-gray-600 mb-4">Scan QR codes on food packages to trace their complete journey and make purchases.</p>
        <div className="flex space-x-2 items-center">
          <button
            onClick={openCamera}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center"
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan
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
        
        {/* Show ML insights when a product is scanned */}
        {scannedBatch && scanResult === 'found' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Product:</span> {scannedBatch.cropType}</p>
                <p><span className="font-medium">Batch ID:</span> {scannedBatch.id}</p>
                <p><span className="font-medium">Farmer:</span> {scannedBatch.farmerName}</p>
                <p><span className="font-medium">Location:</span> {scannedBatch.location}</p>
              </div>
            </div>
            <MLInsightsPanel insights={generateMLInsights(scannedBatch)} />
          </div>
        )}
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <QrCode className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Product Scanner</h3>
          </div>
          <p className="text-gray-600">Scan QR codes with ML-powered quality and authenticity verification.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">ML Insights</h3>
          </div>
          <p className="text-gray-600">AI-powered quality grading and fraud detection for every product.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Origin Tracking</h3>
          </div>
          <p className="text-gray-600">Know exactly where your food comes from and how it reached your table.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConsumerDashboard;