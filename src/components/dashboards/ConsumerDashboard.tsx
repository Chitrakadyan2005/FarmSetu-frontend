import React, { useState } from 'react';
import { QrCode, Search, Shield, MapPin, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProduceBatch } from '../../types';

interface ConsumerDashboardProps {
  currentPage: string;
}

const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({ currentPage }) => {
  const { getBatchById } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const [scannedBatch, setScannedBatch] = useState<ProduceBatch | null>(null);
  const [scanResult, setScanResult] = useState<'found' | 'not-found' | null>(null);

  const handleScan = () => {
    if (searchInput.trim()) {
      const batch = getBatchById(searchInput.trim().toUpperCase());
      if (batch) {
        setScannedBatch(batch);
        setScanResult('found');
      } else {
        setScannedBatch(null);
        setScanResult('not-found');
      }
    }
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

    batch.transfers.forEach((transfer, index) => {
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

  if (currentPage === 'scanner') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanner</h2>
          <p className="text-gray-600">Scan or enter a Batch ID to trace your food's journey</p>
        </div>

        {/* Scanner Simulation */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">QR Scanner Viewport</p>
                <p className="text-sm text-gray-500">Use input below for demo</p>
              </div>
            </div>

            <div className="w-full max-w-md">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Batch ID (e.g., BTH001)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={handleScan}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Results */}
        {scanResult === 'not-found' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">Batch not found</p>
            <p className="text-red-600 text-sm">Please check the Batch ID and try again</p>
          </div>
        )}

        {scannedBatch && scanResult === 'found' && (
          <div className="space-y-6">
            {/* Product Info */}
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </div>

            {/* Journey Timeline */}
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

            {/* Trust Indicators */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-4">Trust Indicators</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800">Blockchain Verified</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800">Organic Certified</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800">Farm Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Batch IDs */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">Demo Batch IDs</h4>
          <p className="text-blue-800 text-sm mb-3">Try scanning these sample batch IDs:</p>
          <div className="flex flex-wrap gap-2">
            {['BTH001', 'BTH002'].map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSearchInput(id);
                  const batch = getBatchById(id);
                  if (batch) {
                    setScannedBatch(batch);
                    setScanResult('found');
                  }
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Consumer Dashboard</h2>
        <p className="text-gray-600">Discover the story behind your food</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
             onClick={() => setSearchInput('')}>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <QrCode className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">QR Scanner</h3>
          </div>
          <p className="text-gray-600">Scan QR codes on food packages to trace their complete journey from farm to store.</p>
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

      {/* How to Use */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">How to Use the Scanner</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-orange-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Find QR Code</h4>
              <p className="text-gray-600 text-sm">Look for the QR code on food packaging or product labels</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-orange-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">Scan or Enter ID</h4>
              <p className="text-gray-600 text-sm">Use the scanner or manually enter the Batch ID</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-orange-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">View Journey</h4>
              <p className="text-gray-600 text-sm">Explore the complete supply chain journey and verify authenticity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;