import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  QrCode,
  Scan,
  Eye,
  Search,
  CheckCircle,
  Clock,
  ShoppingCart,
  Brain,
  AlertTriangle,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AddBatchForm from '../forms/AddBatchForm';
import QRCode from 'react-qr-code';
import MLInsightsPanel from '../insights/MLInsightsPanel';
import { generateMLInsights } from '../../utils/mlInsights';

interface DistributorDashboardProps {
  currentPage: string;
}

interface PurchaseRequest {
  id: string;
  batchId: string;
  buyerName: string;
  buyerProfession: string;
  quantity: number;
  price: number;
  date: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
}

const DistributorDashboard: React.FC<DistributorDashboardProps & { onNavigate?: (page: string) => void }> = ({ currentPage, onNavigate }) => {
  const { batches, transferBatch } = useApp();
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [showBuyForm, setShowBuyForm] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState<any>(null);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showJourneyModal, setShowJourneyModal] = useState<any>(null);
  const [selectedBatchInsights, setSelectedBatchInsights] = useState<any>(null);
  
  const [buyForm, setBuyForm] = useState({
    quantity: '',
    price: ''
  });

  const availableBatches = batches.filter(batch => 
    batch.status === 'harvested' || batch.status === 'distributed'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'harvested': return 'bg-yellow-100 text-yellow-800';
      case 'distributed': return 'bg-blue-100 text-blue-800';
      case 'retail': return 'bg-purple-100 text-purple-800';
      case 'sold': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJourneySteps = (batch: any) => {
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

    batch.transfers?.forEach((transfer: any, index: number) => {
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

  const handleScan = () => {
    try {
      const data = JSON.parse(scanInput);
      setScanResult(data);
      
      if (data.type === 'farmer-batch' || data.type === 'distributor-batch') {
        setShowBuyForm({
          ...data,
          buyerName: 'Mike Distributor',
          buyerProfession: 'Distributor',
          date: new Date().toISOString().split('T')[0],
          location: 'Nevada, USA'
        });
      }
    } catch (e) {
      setScanResult({ error: 'Invalid QR code format' });
    }
  };

  const handleBuy = () => {
    if (!buyForm.quantity || !buyForm.price) return;
    
    const request: PurchaseRequest = {
      id: `PR${Date.now()}`,
      batchId: showBuyForm.batchId,
      buyerName: showBuyForm.buyerName,
      buyerProfession: showBuyForm.buyerProfession,
      quantity: Number(buyForm.quantity),
      price: Number(buyForm.price),
      date: showBuyForm.date,
      location: showBuyForm.location,
      status: 'pending'
    };
    
    setPurchaseRequests(prev => [...prev, request]);
    setShowBuyForm(null);
    setBuyForm({ quantity: '', price: '' });
    
    console.log('Blockchain entry created:', request);
  };

  const approvePurchase = (requestId: string) => {
    setPurchaseRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
    // Navigate to transfers page after approval
    if (onNavigate) {
      setTimeout(() => onNavigate('transfers'), 1000);
    }
  };

  if (currentPage === 'transfers') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Procured Batches</h2>
          <p className="text-gray-600">Manage your inventory and transfers</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Available Inventory with ML Insights</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableBatches.map((batch: any) => {
                  return (
                    <motion.tr
                      key={batch.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{batch.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{batch.cropType}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{batch.quantity} kg</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="font-medium">${batch.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="relative">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === batch.id ? null : batch.id)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Actions
                            <ChevronDown className="w-4 h-4 ml-2" />
                          </button>
                          
                          {activeDropdown === batch.id && (
                            <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    setShowJourneyModal(batch);
                                    setActiveDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <MapPin className="w-4 h-4 mr-2" />
                                  View Journey So Far
                                </button>
                                <button
                                  onClick={() => {
                                    setShowQRModal(batch);
                                    setActiveDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <QrCode className="w-4 h-4 mr-2" />
                                  QR Code
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedBatchInsights(batch);
                                    setActiveDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Brain className="w-4 h-4 mr-2" />
                                  ML Insights
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {availableBatches.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No batches available for transfer</p>
            </div>
          )}
        </div>

        {purchaseRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Purchase Requests with ML Verification</h3>
            </div>
            <div className="p-6">
              {purchaseRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Batch: {request.batchId}</p>
                      <p className="text-sm text-gray-600">Buyer: {request.buyerName} ({request.buyerProfession})</p>
                      <p className="text-sm text-gray-600">Quantity: {request.quantity}kg | Price: ${request.price}</p>
                      <p className="text-sm text-gray-500">Date: {request.date}</p>
                      
                      {/* ML Verification Badge */}
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Brain className="w-3 h-3 mr-1" />
                          ML Verified
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => approvePurchase(request.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 hover:scale-105 transition-transform"
                        >
                          Approve
                        </button>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Product QR Code - {showQRModal.id}</h3>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block shadow">
                  <QRCode value={JSON.stringify({
                    type: 'distributor-batch',
                    batchId: showQRModal.id,
                    data: showQRModal
                  })} size={200} />
                </div>
                <div className="mt-4">
                  <button onClick={() => setShowQRModal(null)} className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Close</button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Share this QR with retailers to show product details</p>
              </div>
            </div>
          </div>
        )}

        {/* Journey Modal */}
        {showJourneyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Journey So Far: {showJourneyModal.cropType}
              </h3>
              
              <div className="space-y-4">
                {getJourneySteps(showJourneyModal).map((step: any, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      {step.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
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
                  </div>
                ))}
              </div>
              
              <button onClick={() => setShowJourneyModal(null)} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Close</button>
            </div>
          </div>
        )}

        {/* ML Insights Modal */}
        {selectedBatchInsights && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    ML Insights - {selectedBatchInsights.id}
                  </h3>
                  <button
                    onClick={() => setSelectedBatchInsights(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Batch Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Batch Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="font-medium">Crop:</span> {selectedBatchInsights.cropType}</p>
                      <p><span className="font-medium">Quantity:</span> {selectedBatchInsights.quantity} kg</p>
                      <p><span className="font-medium">Price:</span> ${selectedBatchInsights.price}/kg</p>
                      <p><span className="font-medium">Status:</span> {selectedBatchInsights.status}</p>
                    </div>
                  </div>
                  
                  {/* ML Insights */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Brain className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-900">ML Analysis Results</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(() => {
                        const insights = generateMLInsights(selectedBatchInsights);
                        return (
                          <>
                            {/* Quality Grade */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Predicted Grade</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  insights.quality.grade === 'A' ? 'bg-green-100 text-green-800' :
                                  insights.quality.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  Grade {insights.quality.grade}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                {Math.round(insights.quality.confidence * 100)}% confidence
                              </div>
                            </div>

                            {/* Suggested Price */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Suggested Price</span>
                                <span className="text-sm font-semibold text-green-600">
                                  ${insights.pricing.suggestedPrice}/kg
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                Current: ${selectedBatchInsights.price}/kg
                              </div>
                            </div>

                            {/* Fraud Detection */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Fraud Detection</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  insights.fraud.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                                  insights.fraud.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {insights.fraud.riskLevel.toUpperCase()} RISK
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                {insights.fraud.flags[0]}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedBatchInsights(null)} 
                  className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
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
        <h2 className="text-2xl font-bold text-gray-900">Distributor Dashboard</h2>
        <p className="text-gray-600">Manage supply chain transfers and logistics</p>
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Batches</p>
              <p className="text-2xl font-bold text-gray-900">{availableBatches.length}</p>
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
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Transfers</p>
              <p className="text-2xl font-bold text-gray-900">
                {batches.reduce((count: number, batch: any) => count + batch.transfers.length, 0)}
              </p>
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {purchaseRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            onClick={() => onNavigate && onNavigate('transfers')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-medium">Approve Transfer Requests</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium">View Analytics</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium">Manage Inventory</span>
          </motion.button>
        </div>
      </motion.div>

      {/* QR Scanner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Scan className="w-5 h-5 mr-2" />
          Product Scanner
        </h3>
        <p className="text-gray-600 mb-4">Scan QR codes on food packages to trace their complete journey and make purchases.</p>
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => {
              alert('Camera would open here in a real app. For demo, please use the input field.');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <Scan className="w-4 h-4 mr-2" />
            Scan
          </button>
          <span className="text-gray-500">OR</span>
          <input
            type="text"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Type Batch ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleScan}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        
        {scanResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Product Details:</h4>
              {(scanResult.type === 'farmer-batch' || scanResult.type === 'distributor-batch') && (
                <button
                  onClick={() => setShowBuyForm({
                    ...scanResult,
                    buyerName: 'Mike Distributor',
                    buyerProfession: 'Distributor',
                    date: new Date().toISOString().split('T')[0],
                    location: 'Nevada, USA'
                  })}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Buy
                </button>
              )}
            </div>
            {scanResult.error ? (
              <p className="text-red-600">{scanResult.error}</p>
            ) : (
              <div className="text-sm text-gray-700">
                <p><strong>Product:</strong> {scanResult.data?.cropType || 'Unknown'}</p>
                <p><strong>Batch ID:</strong> {scanResult.batchId || 'Unknown'}</p>
                <p><strong>Farmer:</strong> {scanResult.farmerName || scanResult.data?.farmerName || 'Unknown'}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Buy Form Modal */}
      {showBuyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
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
                    value={showBuyForm.data?.cropType || 'Unknown'} 
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleBuy}
                  disabled={!buyForm.quantity || !buyForm.price}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Purchase
                </button>
                <button 
                  onClick={() => setShowBuyForm(null)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            {/* ML Insights for the product being purchased */}
            {showBuyForm.data && (
              <div className="mt-4">
                <MLInsightsPanel insights={generateMLInsights(showBuyForm.data)} />
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DistributorDashboard;