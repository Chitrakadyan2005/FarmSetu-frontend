export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'distributor' | 'consumer' | 'retailer';
}

export interface ProduceBatch {
  id: string;
  cropType: string;
  harvestDate: string;
  quantity: number;
  price: number;
  farmerId: string;
  farmerName: string;
  status: 'harvested' | 'distributed' | 'retail' | 'sold';
  currentOwner: string;
  transfers: Transfer[];
  location: string;
}

export interface Transfer {
  id: string;
  from: string;
  to: string;
  timestamp: string;
  location: string;
  status: string;
}