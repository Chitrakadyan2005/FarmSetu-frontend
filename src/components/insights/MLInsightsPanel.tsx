import React from 'react';
import { Brain, TrendingUp, Shield, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import { MLInsights } from '../../utils/mlInsights';

interface MLInsightsPanelProps {
  insights: MLInsights;
  className?: string;
}

const MLInsightsPanel: React.FC<MLInsightsPanelProps> = ({ insights, className = '' }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-600 rotate-90" />;
    }
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center mb-3">
        <Brain className="w-5 h-5 text-blue-600 mr-2" />
        <h4 className="font-semibold text-blue-900">ML Insights</h4>
      </div>
      
      <div className="space-y-3">
        {/* Quality Prediction */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Quality Grade</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeColor(insights.quality.grade)}`}>
              Grade {insights.quality.grade}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-xs text-gray-600">
              {Math.round(insights.quality.confidence * 100)}% confidence
            </span>
          </div>
          <div className="text-xs text-gray-600">
            {insights.quality.factors.slice(0, 2).join(', ')}
          </div>
        </div>

        {/* Price Prediction */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Price Insights</span>
            <div className="flex items-center">
              {getTrendIcon(insights.pricing.marketTrend)}
              <span className="text-xs text-gray-600 ml-1 capitalize">
                {insights.pricing.marketTrend}
              </span>
            </div>
          </div>
          <div className="text-sm font-semibold text-green-600">
            ₹{insights.pricing.suggestedPrice}/kg
          </div>
          <div className="text-xs text-gray-600">
            Range: ₹{insights.pricing.priceRange.min} - ₹{insights.pricing.priceRange.max}
          </div>
        </div>

        {/* Fraud Detection */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Fraud Check</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(insights.fraud.riskLevel)}`}>
              {insights.fraud.riskLevel === 'low' ? (
                <CheckCircle className="w-3 h-3 inline mr-1" />
              ) : (
                <AlertTriangle className="w-3 h-3 inline mr-1" />
              )}
              {insights.fraud.riskLevel.toUpperCase()} RISK
            </span>
          </div>
          <div className="text-xs text-gray-600">
            {insights.fraud.flags[0]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLInsightsPanel;