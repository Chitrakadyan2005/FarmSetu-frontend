import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, FileText, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProduceBatch } from '../../types';

interface RegulatorDashboardProps {
  currentPage: string;
}

const RegulatorDashboard: React.FC<RegulatorDashboardProps> = ({ currentPage }) => {
  const { batches, getBatchById } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<ProduceBatch | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'audit'>('overview');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const batch = getBatchById(searchQuery.trim().toUpperCase());
      if (batch) {
        setSelectedBatch(batch);
        setViewMode('audit');
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

  const getComplianceScore = (batch: ProduceBatch) => {
    let score = 70; // Base score
    if (batch.transfers.length > 0) score += 15;
    if (batch.status !== 'harvested') score += 10;
    if (batch.price > 0) score += 5;
    return Math.min(score, 100);
  };

  if (currentPage === 'audit' || viewMode === 'audit') {
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
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Overview
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Audit & Compliance</h2>
          <p className="text-gray-600">Search and audit supply chain records</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Search</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Batch ID for audit (e.g., BTH001)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Audit
            </button>
          </div>
        </div>

        {/* Batch Details */}
        {selectedBatch && (
          <div className="space-y-6">
            {/* Compliance Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Compliance Overview</h3>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${getComplianceScore(selectedBatch) >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="font-semibold">{getComplianceScore(selectedBatch)}% Compliant</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{selectedBatch.id}</p>
                  <p className="text-sm text-gray-600">Batch ID</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{selectedBatch.transfers.length + 1}</p>
                  <p className="text-sm text-gray-600">Total Handlers</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.ceil((Date.now() - new Date(selectedBatch.harvestDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-gray-600">Days in Supply Chain</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBatch.status)}`}>
                    {selectedBatch.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Current Status</p>
                </div>
              </div>
            </div>

            {/* Chain of Custody */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Chain of Custody</h3>
              
              <div className="space-y-4">
                {/* Origin */}
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Origin - Farm</h4>
                      <p className="text-gray-600">{selectedBatch.farmerName}</p>
                      <p className="text-sm text-gray-500">{selectedBatch.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(selectedBatch.harvestDate).toLocaleDateString()}
                      </p>
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    </div>
                  </div>
                </div>

                {/* Transfers */}
                {selectedBatch.transfers.map((transfer, index) => (
                  <div key={transfer.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Transfer {index + 1}</h4>
                        <p className="text-gray-600">{transfer.from} → {transfer.to}</p>
                        <p className="text-sm text-gray-500">{transfer.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {new Date(transfer.timestamp).toLocaleDateString()}
                        </p>
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Signatures */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Digital Signatures & Verification</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium">Farm Certification</p>
                      <p className="text-sm text-gray-600">Digital signature verified</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">Verified</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium">Quality Inspection</p>
                      <p className="text-sm text-gray-600">Third-party validation</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">Verified</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-yellow-500 mr-3" />
                    <div>
                      <p className="font-medium">Transport Conditions</p>
                      <p className="text-sm text-gray-600">Temperature and handling logs</p>
                    </div>
                  </div>
                  <span className="text-yellow-600 font-medium">Partial</span>
                </div>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Compliance Checklist</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-900">Organic certification verified</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-900">Supply chain transparency maintained</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-900">Proper documentation provided</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
                  <span className="text-gray-900">Cold chain monitoring needs verification</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Help */}
        {!selectedBatch && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Available Batch IDs for Audit</h4>
            <p className="text-blue-800 text-sm mb-3">Try auditing these sample batches:</p>
            <div className="flex flex-wrap gap-2">
              {batches.map((batch) => (
                <button
                  key={batch.id}
                  onClick={() => {
                    setSearchQuery(batch.id);
                    setSelectedBatch(batch);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  {batch.id}
                </button>
              ))}
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
        <h2 className="text-2xl font-bold text-gray-900">Regulator Dashboard</h2>
        <p className="text-gray-600">Monitor compliance and audit supply chain transparency</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Batches</p>
              <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Compliant</p>
              <p className="text-2xl font-bold text-gray-900">
                {batches.filter(b => getComplianceScore(b) >= 80).length}
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
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Needs Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {batches.filter(b => getComplianceScore(b) < 80).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Farms</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(batches.map(b => b.farmerId)).size}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setViewMode('audit')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium">Audit Batch</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium">Generate Report</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Shield className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-medium">Verify Certificates</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Compliance Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-white rounded-lg shadow"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Batch Compliance</h3>
        </div>
        <div className="overflow-x-auto">
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
                  Farmer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map((batch) => {
                const score = getComplianceScore(batch);
                return (
                  <tr key={batch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {batch.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {batch.cropType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {batch.farmerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-sm font-medium">{score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => {
                          setSelectedBatch(batch);
                          setViewMode('audit');
                        }}
                        className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Audit
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

export default RegulatorDashboard;