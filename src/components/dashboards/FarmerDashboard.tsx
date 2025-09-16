import React, { useState } from 'react';
import { Package, Plus, Calendar, DollarSign, TrendingUp, QrCode, Scan, Eye, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AddBatchForm from '../forms/AddBatchForm';
import QRCode from 'react-qr-code';

interface FarmerDashboardProps {
  currentPage: string;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ currentPage }) => {
  const { user, batches, getBatchById } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showQRModal, setShowQRModal] = useState<any>(null);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

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

  if (currentPage === 'batches') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">My Batches</h2>
          <p className="text-gray-600">Manage your crop batches and track their journey</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Batch
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harvest Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {batch.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {batch.cropType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(batch.harvestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {batch.quantity} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${batch.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => setShowQRModal(batch)}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {userBatches.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No batches created yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Create your first batch
              </button>
            </div>
          )}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
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

        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Product QR Code - {showQRModal.id}</h3>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block">
                  <QRCode value={getBatchQRValue(showQRModal)} size={200} />
                </div>
                <div className="mt-4 space-y-2">
                  <button onClick={() => setShowQRModal(null)} className="w-full border border-gray-300 py-2 rounded-lg">Close</button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Share this QR with buyers to show product details</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h2>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Batches</p>
              <p className="text-2xl font-bold text-gray-900">{userBatches.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
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
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
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
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-medium">Add New Batch</span>
          </button>
          
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium">Schedule Harvest</span>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium">View Analytics</span>
          </button>
        </div>
      </div>

      {/* QR Scanner */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <QrCode className="w-5 h-5 mr-2" />
          Product Scanner
        </h3>
        <p className="text-gray-600 mb-4">Scan QR codes on food packages to trace their complete journey and make purchases.</p>
        <div className="flex space-x-2">
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
        
        {scanResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Scan Result:</h4>
            {scanResult.error ? (
              <p className="text-red-600">{scanResult.error}</p>
            ) : (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">{JSON.stringify(scanResult, null, 2)}</pre>
            )}
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
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
    </div>
  );
};

export default FarmerDashboard;