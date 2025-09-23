import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Package, CheckCircle, Eye, Brain, Store, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProduceBatch } from '../../types';
import JourneyModal from '../common/JourneyModal';
import { generateMLInsights } from '../../utils/mlInsights';

interface RetailerDashboardProps {
  currentPage: string;
}

const RetailerDashboard: React.FC<RetailerDashboardProps> = ({ currentPage }) => {
  const { batches, getBatchById } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<ProduceBatch | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'inventory'>('overview');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const batch = getBatchById(searchQuery.trim().toUpperCase());
      if (batch) {
        setSelectedBatch(batch);
        setViewMode('inventory');
      } else {
        setSelectedBatch(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'harvested': return 'bg-yellow-100 text-yellow-800';
      case 'distributed': return 'bg-blue-100 text-blue-800';
      case 'retail': return 'bg-purple-100 text-purple-800';
      case 'sold': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityScore = (batch: ProduceBatch) => {
    const insights = generateMLInsights(batch);
    return insights.quality.grade;
  };

  const getBatchQRValue = (batch: any) => {
    return JSON.stringify({
      type: 'retailer-batch',
      batchId: batch.id,
      data: batch
    });
  };

  const getBatchJourney = (batch: any) => {
    const journey = [
      {
        stage: 'Farm Origin',
        handler: batch.farmerName,
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

    // Add retail stage
    journey.push({
      stage: 'Retail Store',
      handler: 'Fresh Market Store',
      location: 'Oregon, USA',
      timestamp: new Date().toISOString(),
      details: 'Available for consumer purchase'
    });

    return journey;
  };

  // Filter batches that would be available to retailers (distributed status)
  const availableBatches = batches.filter(batch => 
    batch.status === 'distributed' || batch.status === 'retail'
  );

  if (currentPage === 'inventory' || viewMode === 'inventory') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-8">
          <button
            onClick={() => setViewMode('overview')}
            className="text-orange-600 hover:text-orange-700 mb-4"
          >
            ← Back to Overview
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Search and manage your product inventory</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Search</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Batch ID to view product details (e.g., BTH001)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Available Inventory */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Available Inventory with ML Insights</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ML Quality</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableBatches.map((batch) => {
                  const qualityGrade = getQualityScore(batch);
                  const insights = generateMLInsights(batch);
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
                      <td className="px-6 py-4 text-sm text-gray-900">{batch.currentOwner}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{batch.quantity} kg</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${batch.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          qualityGrade === 'A' ? 'bg-green-100 text-green-800' :
                          qualityGrade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Grade {qualityGrade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <button
                          onClick={() => setSelectedBatch(batch)}
                          className="text-orange-600 hover:text-orange-800 font-medium flex items-center hover:underline"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Actions
                        </button>
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
              <p className="text-gray-500">No products available in inventory</p>
            </div>
          )}
        </div>

        {/* Search Help */}
        {!selectedBatch && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h4 className="font-semibold text-orange-900 mb-2">Available Batch IDs for Search</h4>
            <p className="text-orange-800 text-sm mb-3">Try searching these sample batches:</p>
            <div className="flex flex-wrap gap-2">
              {availableBatches.map((batch) => (
                <button
                  key={batch.id}
                  onClick={() => {
                    setSearchQuery(batch.id);
                    setSelectedBatch(batch);
                  }}
                  className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                >
                  {batch.id}
                </button>
              ))}
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
            title={`Product Actions - ${selectedBatch.id}`}
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Store Retailer! 🏪
        </h2>
        <p className="text-gray-600 mb-8">Here's an overview of your store activity.</p>
          className="text-purple-600 hover:text-purple-700 mb-4"

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Products</p>
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <Store className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Store</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableBatches.filter(b => b.status === 'retail').length}
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${availableBatches.reduce((sum, batch) => sum + (batch.price * batch.quantity), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
      <motion.div 
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2 text-purple-600" />
          Product Search
        </h3>
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setViewMode('inventory')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Search className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium">Search Products</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Package className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium">Manage Inventory</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium">View Analytics</span>
          </motion.button>
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
      </motion.div>

      {/* QR Scanner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <QrCode className="w-5 h-5 mr-2 text-purple-600" />
          Product Scanner
        </h3>
        <p className="text-gray-600 mb-4">Scan QR codes on food packages to trace their complete journey.</p>
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => {
              alert('Camera would open here in a real app. For demo, please use the input field.');
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Scan
          </button>
          <span className="text-gray-500">OR</span>
          <input
            type="text"
            placeholder="Paste QR data"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Product Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-white rounded-lg shadow"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-purple-600" />
            Product Overview
          <h3 className="text-lg font-semibold text-gray-900">Available Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ML Quality Grade
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {availableBatches.map((batch) => {
                const insights = generateMLInsights(batch);
                return (
                  <tr key={batch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => {
                          setSelectedBatch(batch);
                          setViewMode('inventory');
                        }}
                        className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Actions
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RetailerDashboard;