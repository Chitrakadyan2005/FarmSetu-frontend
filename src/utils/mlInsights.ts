// ML Insights utility functions
export interface QualityPrediction {
  grade: 'A' | 'B' | 'C';
  confidence: number;
  factors: string[];
}

export interface PricePrediction {
  suggestedPrice: number;
  priceRange: { min: number; max: number };
  marketTrend: 'rising' | 'stable' | 'declining';
}

export interface FraudDetection {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  flags: string[];
  recommendation: string;
}

export interface MLInsights {
  quality: QualityPrediction;
  pricing: PricePrediction;
  fraud: FraudDetection;
}

// Simulate ML predictions based on batch data
export const generateMLInsights = (batch: any): MLInsights => {
  // Quality prediction based on crop type, harvest date, and location
  const qualityGrade = getQualityGrade(batch);
  const qualityConfidence = Math.random() * 0.3 + 0.7; // 70-100%
  
  // Price prediction based on crop type and market conditions
  const basePriceMultiplier = getPriceMultiplier(batch.cropType);
  const suggestedPrice = batch.price * basePriceMultiplier;
  
  // Fraud detection based on various factors
  const fraudRisk = getFraudRisk(batch);
  
  return {
    quality: {
      grade: qualityGrade,
      confidence: qualityConfidence,
      factors: getQualityFactors(batch, qualityGrade)
    },
    pricing: {
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      priceRange: {
        min: Math.round(suggestedPrice * 0.85 * 100) / 100,
        max: Math.round(suggestedPrice * 1.15 * 100) / 100
      },
      marketTrend: getMarketTrend(batch.cropType)
    },
    fraud: {
      riskLevel: fraudRisk.level,
      confidence: fraudRisk.confidence,
      flags: fraudRisk.flags,
      recommendation: fraudRisk.recommendation
    }
  };
};

const getQualityGrade = (batch: any): 'A' | 'B' | 'C' => {
  const isOrganic = batch.cropType.toLowerCase().includes('organic');
  const daysSinceHarvest = Math.ceil((Date.now() - new Date(batch.harvestDate).getTime()) / (1000 * 60 * 60 * 24));
  
  if (isOrganic && daysSinceHarvest <= 3) return 'A';
  if (daysSinceHarvest <= 7) return 'A';
  if (daysSinceHarvest <= 14) return 'B';
  return 'C';
};

const getPriceMultiplier = (cropType: string): number => {
  const multipliers: Record<string, number> = {
    'Organic Tomatoes': 1.1,
    'Fresh Carrots': 0.95,
    'Organic Lettuce': 1.05,
    'Bell Peppers': 1.0,
    'Organic Potatoes': 0.9,
    'Fresh Spinach': 1.15,
    'Organic Broccoli': 1.2,
    'Sweet Corn': 0.85
  };
  return multipliers[cropType] || 1.0;
};

const getQualityFactors = (batch: any, grade: string): string[] => {
  const factors = [];
  
  if (batch.cropType.toLowerCase().includes('organic')) {
    factors.push('Organic certification');
  }
  
  const daysSinceHarvest = Math.ceil((Date.now() - new Date(batch.harvestDate).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceHarvest <= 3) {
    factors.push('Recently harvested');
  } else if (daysSinceHarvest <= 7) {
    factors.push('Fresh produce');
  }
  
  if (batch.location.includes('California')) {
  }
  if (batch.location.includes('Punjab') || batch.location.includes('Haryana')) {
    factors.push('Premium growing region');
  }
  
  if (grade === 'A') {
    factors.push('Optimal storage conditions');
  }
  
  return factors;
};

const getFraudRisk = (batch: any): { level: 'low' | 'medium' | 'high'; confidence: number; flags: string[]; recommendation: string } => {
  const flags = [];
  let riskScore = 0;
  
  // Check for unusual pricing
  const expectedPrice = batch.cropType.toLowerCase().includes('organic') ? 35 : 25;
  if (batch.price > expectedPrice * 2) {
    flags.push('Unusually high pricing');
    riskScore += 30;
  }
  
  // Check harvest date consistency
  const daysSinceHarvest = Math.ceil((Date.now() - new Date(batch.harvestDate).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceHarvest > 30) {
    flags.push('Old harvest date');
    riskScore += 20;
  }
  
  // Check quantity consistency
  if (batch.quantity > 500) {
    flags.push('Large quantity for small farm');
    riskScore += 15;
  }
  
  // Random additional checks
  if (Math.random() < 0.1) {
    flags.push('Location verification needed');
    riskScore += 25;
  }
  
  let level: 'low' | 'medium' | 'high' = 'low';
  let recommendation = 'No issues detected. Proceed with confidence.';
  
  if (riskScore >= 50) {
    level = 'high';
    recommendation = 'Manual verification recommended before approval.';
  } else if (riskScore >= 25) {
    level = 'medium';
    recommendation = 'Additional documentation may be required.';
  }
  
  return {
    level,
    confidence: Math.random() * 0.2 + 0.8, // 80-100%
    flags: flags.length > 0 ? flags : ['All checks passed'],
    recommendation
  };
};

const getMarketTrend = (cropType: string): 'rising' | 'stable' | 'declining' => {
  const trends: Record<string, 'rising' | 'stable' | 'declining'> = {
    'Organic Tomatoes': 'rising',
    'Fresh Carrots': 'stable',
    'Organic Lettuce': 'rising',
    'Bell Peppers': 'stable',
    'Organic Potatoes': 'declining',
    'Fresh Spinach': 'rising',
    'Organic Broccoli': 'rising',
    'Sweet Corn': 'declining'
  };
  return trends[cropType] || 'stable';
};