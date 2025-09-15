import React, { useState } from 'react';
import { Truck, CheckCircle, Clock, Package, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DistributorDashboardProps {
  currentPage: string;
}

const DistributorDashboard: React.FC<DistributorDashboardProps> = ({ currentPage }) => {
  const { batches, transferBatch } = useApp();
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [transferTo, setTransferTo] = useState('');
  const [location, setLocation] = useState('');

  const availableBatches = batches.filter(batch => 
    batch.status === 'harvested' || batch.status === 'distributed'
  );

  const handleTransfer = (batchId: string) => {
    if (transferTo && location) {
      transferBatch(batchId, transferTo, location);
      setSelectedBatch(null);
      setTransferTo('');
      setLocation('');
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

  if (currentPage === 'transfers') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Batch Transfers</h2>

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
                  Current Owner
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
              {availableBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {batch.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {batch.cropType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {batch.currentOwner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => setSelectedBatch(batch.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Transfer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedBatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Transfer Batch {selectedBatch}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer To
                  </label>
                  <select
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select recipient</option>
                    <option value="FreshMart Retail">FreshMart Retail</option>
                    <option value="GreenGrocer Co">GreenGrocer Co</option>
                    <option value="Farm2Table Distribution">Farm2Table Distribution</option>
                    <option value="Organic Markets Ltd">Organic Markets Ltd</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleTransfer(selectedBatch)}
                    disabled={!transferTo || !location}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Transfer
                  </button>
                  <button
                    onClick={() => setSelectedBatch(null)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
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
        <h2 className="text-2xl font-bold text-gray-900">Distributor Dashboard</h2>
        <p className="text-gray-600">Manage supply chain transfers and logistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Batches</p>
              <p className="text-2xl font-bold text-gray-900">{availableBatches.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Transfers</p>
              <p className="text-2xl font-bold text-gray-900">
                {batches.reduce((count, batch) => count + batch.transfers.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {batches.filter(b => b.status === 'distributed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Truck className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium">Schedule Pickup</span>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-medium">Accept Batch</span>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CheckCircle className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium">Update Status</span>
          </button>
        </div>
      </div>

      {/* Recent Transfers Timeline */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transfer Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {batches.filter(batch => batch.transfers.length > 0).slice(0, 5).map((batch) => (
              <div key={batch.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{batch.cropType} - {batch.id}</p>
                    <p className="text-sm text-gray-600">
                      Latest transfer: {batch.transfers[batch.transfers.length - 1]?.to || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ArrowRight className="w-4 h-4 mr-1" />
                    {new Date(batch.transfers[batch.transfers.length - 1]?.timestamp || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {batches.filter(batch => batch.transfers.length > 0).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No transfer activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;