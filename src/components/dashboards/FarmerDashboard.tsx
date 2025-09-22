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
  Brain,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AddBatchForm from '../forms/AddBatchForm';
import QRCode from 'react-qr-code';
import MLInsightsPanel from '../insights/MLInsightsPanel';
import { generateMLInsights } from '../../utils/mlInsights';

interface FarmerDashboardProps {
  currentPage: string;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ currentPage }) => {
  const { user, batches } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showQRModal, setShowQRModal] = useState<any>(null);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedBatchInsights, setSelectedBatchInsights] = useState<any>(null);
  const [showJourneyModal, setShowJourneyModal] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const userBatches = batches.filter(batch => batch.farmerId === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'harvested': return 'bg-yellow-100 text-yellow-800';
      case 'distributed': return 'bg-blue-100 text-blue-800';
      case 'retail': return 'bg-purple-100 text-purple-800';
      case 'sold': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatchQRValue = (batch: any) => {
    return JSON.stringify({
      type: 'farmer-batch',
      batchId: batch.id,
      farmerId: user?.id,
      farmerName: user?.name,
      data: {
        cropType: batch.cropType,
        harvestDate: batch.harvestDate,
        quantity: batch.quantity,
        price: batch.price,
        farmerLocation: batch.location,
        farmerContact: user?.email,
        journey: [
          {
            stage: 'Farm Origin',
            handler: user?.name,
            location: batch.location,
            timestamp: batch.harvestDate,
            details: `Harvested ${batch.quantity}kg of ${batch.cropType}`
          }
        ]
      }
    });
  };

  const handleScan = () => {
    try {
      const data = JSON.parse(scanInput);
      setScanResult(data);
    } catch (e) {
      setScanResult({ error: 'Invalid QR code format' });
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

  if (currentPage === 'batches') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">My Batches</h2>
          <p className="text-gray-600">Manage your crop batches and track their journey</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 hover:scale-105 transition-transform flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Batch
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My Batches</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harvest Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userBatches.map((batch) => {
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
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(batch.harvestDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{batch.quantity} kg</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${batch.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
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
          {userBatches.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No batches created yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 text-green-600 hover:text-green-700 font-medium hover:underline"
              >
                Create your first batch
              </button>
            </div>
          )}
        </div>
        </div>

        {/* Add Batch Modal */}
        {showAddForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddForm(false)}
          >
            <div
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add New Batch</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <AddBatchForm onSuccess={() => setShowAddForm(false)} />
              </div>
            </div>
          </div>
        )}

        {/* QR Modal */}
        {showQRModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowQRModal(null)}
          >
            <div
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Product QR Code - {showQRModal.id}</h3>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block shadow">
                  <QRCode value={getBatchQRValue(showQRModal)} size={200} />
                </div>
                <div className="mt-4 space-y-2">
                  <button onClick={() => setShowQRModal(null)} className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                    Close
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Share this QR with buyers to show product details</p>
              </div>
            </div>
          </div>
        )}

        {/* ML Insights Modal */}
        {selectedBatchInsights && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedBatchInsights(null)}
          >
            <div
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Batch Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Crop:</span> {selectedBatchInsights.cropType}</p>
                      <p><span className="font-medium">Quantity:</span> {selectedBatchInsights.quantity} kg</p>
                      <p><span className="font-medium">Price:</span> ${selectedBatchInsights.price}/kg</p>
                      <p><span className="font-medium">Harvest:</span> {new Date(selectedBatchInsights.harvestDate).toLocaleDateString()}</p>
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
                                Range: ${insights.pricing.priceRange.min} - ${insights.pricing.priceRange.max}
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
      {/* Welcome Line instead of "Farmer Dashboard" */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.name}! 🌱
      </h2>
      <p className="text-gray-600 mb-8">Here's an overview of your farm activity.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Batches</p>
              <p className="text-2xl font-bold text-gray-900">{userBatches.length}</p>
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Batches</p>
              <p className="text-2xl font-bold text-gray-900">
                {userBatches.filter(b => b.status !== 'sold').length}
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
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${userBatches.reduce((sum, batch) => sum + (batch.price * batch.quantity), 0).toFixed(2)}
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
            onClick={() => setShowAddForm(true)}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Plus className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-medium">Add New Batch</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Calendar className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium">Schedule Harvest</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium">View Analytics</span>
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
          <QrCode className="w-5 h-5 mr-2" />
          Product Scanner
        </h3>
        <p className="text-gray-600 mb-4">Scan QR codes on food packages to trace their complete journey.</p>
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => {
              alert('Camera would open here in a real app. For demo, please use the input field.');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
          >
            <Scan className="w-4 h-4 mr-2" />
            Scan
          </button>
          <span className="text-gray-500">OR</span>
          <input
            type="text"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Paste QR data"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={handleScan}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        
        {scanResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg"
          >
            <h4 className="font-medium mb-2">Scan Result:</h4>
            {scanResult.error ? (
              <p className="text-red-600">{scanResult.error}</p>
            ) : (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {JSON.stringify(scanResult, null, 2)}
              </pre>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Add Batch Modal (Dashboard quick actions) */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add New Batch</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <AddBatchForm onSuccess={() => setShowAddForm(false)} />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FarmerDashboard;