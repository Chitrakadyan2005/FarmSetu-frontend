import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Brain, QrCode, Shield, Truck, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import QRCode from 'react-qr-code';
import MLInsightsPanel from '../insights/MLInsightsPanel';
import { generateMLInsights, getDummyRiceInsights } from '../../utils/mlInsights';

interface JourneyStep {
  stage: string;
  handler: string;
  location: string;
  timestamp: string;
  details: string;
}

interface JourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: any;
  journey: JourneyStep[];
  qrValue: string;
  title: string;
}

const JourneyModal: React.FC<JourneyModalProps> = ({
  isOpen,
  onClose,
  batch,
  journey,
  qrValue,
  title
}) => {
  const [activeTab, setActiveTab] = useState<'journey' | 'qr' | 'insights'>('journey');

  if (!isOpen) return null;

  const insights = generateMLInsights(batch);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-lg"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('journey')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'journey'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Journey
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                activeTab === 'qr'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <QrCode className="w-4 h-4 mr-1" />
              QR Code
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                activeTab === 'insights'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Brain className="w-4 h-4 mr-1" />
              ML Insights
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'journey' && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Farm-to-Fork Journey: {batch.cropType}
              </h4>
              
              <div className="space-y-4">
                {journey.map((step, index) => (
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
          )}

          {activeTab === 'qr' && (
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-4">Product QR Code</h4>
              <div className="bg-white p-4 rounded-lg inline-block shadow border">
                <QRCode value={qrValue} size={250} />
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Share this QR code to provide complete product traceability
              </p>
            </div>
          )}

          {activeTab === 'insights' && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                ML Quality & Authenticity Analysis
              </h4>
              
              {/* Enhanced ML Insights with Supply Chain */}
              <div className="space-y-6">
                {/* Supply Chain Recommendation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Truck className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">Supply Chain Recommendation</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium text-blue-700">🚛 Recommended Route:</span>
                      <span className="ml-2 text-blue-600 font-semibold">{insights.supplyChain.recommendedRoute}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">⏰ Optimal Storage Time:</span>
                      <span className="ml-2 text-blue-600">{insights.supplyChain.optimalStorageTime} hrs</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">🚚 Predicted Delivery Time:</span>
                      <span className="ml-2 text-blue-600">{insights.supplyChain.predictedDeliveryTime} hrs</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">🍃 Expected Spoilage:</span>
                      <span className="ml-2 text-blue-600">{insights.supplyChain.expectedSpoilage}%</span>
                    </div>
                  </div>
                  <div className="text-sm text-blue-700 mb-3">
                    <span className="font-medium">🎯 Quantity to Send:</span>
                    <span className="ml-2 text-blue-600 font-semibold">{insights.supplyChain.quantityToSend} kg</span>
                  </div>
<img 
  src="../MLImages/Storage.jpg" 
  alt="Pricing Graph" 
  className="w-full max-w-2xl mx-auto"
/>               
                </div>

                {/* Quality & Grade */}
                {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Quality Assessment</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-green-700">Quality Grade:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        insights.quality.grade === 'A' ? 'bg-green-100 text-green-800' :
                        insights.quality.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Grade {insights.quality.grade}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-green-700">Confidence:</span>
                      <span className="ml-2 text-green-600">{Math.round(insights.quality.confidence * 100)}%</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-green-700">
                    <span className="font-medium">Key Factors:</span> {insights.quality.factors.join(', ')}
                  </div>
                </div> */}

                {/* Pricing Insights */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-medium text-purple-800">Pricing Analysis</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-purple-700">Actual Price:</span>
                      <span className="ml-2 text-purple-600">₹{batch.price}/kg</span>
                    </div>
                    <div>
                      <span className="font-medium text-purple-700">Predicted Price:</span>
                      <span className="ml-2 text-purple-600 font-semibold">₹{insights.pricing.suggestedPrice}/kg</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-purple-700">
                    <span className="font-medium">Price Range:</span> ₹{insights.pricing.priceRange.min} - ₹{insights.pricing.priceRange.max}/kg
                  </div>
                  <div className="mt-1 text-sm text-purple-700 mb-3">
                    <span className="font-medium">Market Trend:</span> 
                    <span className={`ml-2 capitalize ${
                      insights.pricing.marketTrend === 'rising' ? 'text-green-600' :
                      insights.pricing.marketTrend === 'declining' ? 'text-red-600' :
                      'text-purple-600'
                    }`}>
                      {insights.pricing.marketTrend}
                    </span>
                  </div>
<img 
  src="../MLImages/Pricing.jpg" 
  alt="Pricing Graph" 
  className="w-full max-w-2xl mx-auto"
/>
                </div>

                {/* Fraud Detection */}
                <div className={`border rounded-lg p-4 ${
                  insights.fraud.riskLevel === 'low' ? 'bg-green-50 border-green-200' :
                  insights.fraud.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center mb-3">
                    <AlertTriangle className={`w-5 h-5 mr-2 ${
                      insights.fraud.riskLevel === 'low' ? 'text-green-600' :
                      insights.fraud.riskLevel === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                    <span className={`font-medium ${
                      insights.fraud.riskLevel === 'low' ? 'text-green-800' :
                      insights.fraud.riskLevel === 'medium' ? 'text-yellow-800' :
                      'text-red-800'
                    }`}>
                      Fraud & Anomaly Detection
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={`font-medium ${
                        insights.fraud.riskLevel === 'low' ? 'text-green-700' :
                        insights.fraud.riskLevel === 'medium' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        Risk Level:
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        insights.fraud.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                        insights.fraud.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {insights.fraud.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                    <div>
                      <span className={`font-medium ${
                        insights.fraud.riskLevel === 'low' ? 'text-green-700' :
                        insights.fraud.riskLevel === 'medium' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        Confidence:
                      </span>
                      <span className={`ml-2 ${
                        insights.fraud.riskLevel === 'low' ? 'text-green-600' :
                        insights.fraud.riskLevel === 'medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {Math.round(insights.fraud.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className={`mt-2 text-sm ${
                    insights.fraud.riskLevel === 'low' ? 'text-green-700' :
                    insights.fraud.riskLevel === 'medium' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    <span className="font-medium">Analysis:</span> {insights.fraud.flags.join(', ')}
                  </div>
                  <div className={`mt-1 text-sm ${
                    insights.fraud.riskLevel === 'low' ? 'text-green-700' :
                    insights.fraud.riskLevel === 'medium' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    <span className="font-medium">Recommendation:</span> {insights.fraud.recommendation}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default JourneyModal;