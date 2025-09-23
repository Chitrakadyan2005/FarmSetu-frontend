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
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AddBatchForm from '../forms/AddBatchForm';
import JourneyModal from '../common/JourneyModal';

interface FarmerDashboardProps {
  currentPage: string;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ currentPage }) => {
  const { user, batches } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

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

  const getBatchJourney = (batch: any) => {
    const journey = [
      {
        stage: 'Farm Origin',
        handler: user?.name || 'Unknown Farmer',
        location: batch.location,
        timestamp: batch.harvestDate,
        details: `Harvested ${batch.quantity}kg of ${batch.cropType}`
      }
    ];

    batch.transfers?.forEach((transfer: any, index: number) => {
      journey.push({
        stage: `Transfer ${index + 1}`,
        handler: transfer.to,
        location: transfer.location,
        timestamp: transfer.timestamp,
        details: `Transferred to ${transfer.to}`
      });
    });

    return journey;
  };
  const handleScan = () => {
    try {
      const data = JSON.parse(scanInput);
      setScanResult(data);
    } catch (e) {
      setScanResult({ error: 'Invalid QR code format' });
    }
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
          {/* Search */}
          <div className="flex-1 mr-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search batches..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>
          </div>
          
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
              {userBatches.map((batch) => (
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
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <button
                        onClick={() => setSelectedBatch(batch)}
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

        {/* Journey Modal */}
        {selectedBatch && (
          <JourneyModal
            isOpen={!!selectedBatch}
            onClose={() => setSelectedBatch(null)}
            batch={selectedBatch}
            journey={getBatchJourney(selectedBatch)}
            qrValue={getBatchQRValue(selectedBatch)}
            title={`Batch Actions - ${selectedBatch.id}`}
          />
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