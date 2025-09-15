import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, ProduceBatch, Transfer } from '../types';

interface AppContextType {
  user: User | null;
  batches: ProduceBatch[];
  login: (email: string, password: string, role: string) => boolean;
  logout: () => void;
  addBatch: (batch: Omit<ProduceBatch, 'id' | 'transfers'>) => void;
  transferBatch: (batchId: string, to: string, location: string) => void;
  getBatchById: (id: string) => ProduceBatch | undefined;
  updateBatchStatus: (batchId: string, status: ProduceBatch['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock users data
const mockUsers = [
  { id: '1', name: 'John Farmer', email: 'farmer@demo.com', role: 'farmer' as const },
  { id: '2', name: 'Mike Distributor', email: 'distributor@demo.com', role: 'distributor' as const },
  { id: '3', name: 'Sarah Consumer', email: 'consumer@demo.com', role: 'consumer' as const },
  { id: '4', name: 'Admin Regulator', email: 'regulator@demo.com', role: 'regulator' as const },
];

// Mock initial batches
const initialBatches: ProduceBatch[] = [
  {
    id: 'BTH001',
    cropType: 'Organic Tomatoes',
    harvestDate: '2024-01-15',
    quantity: 100,
    price: 5.99,
    farmerId: '1',
    farmerName: 'John Farmer',
    status: 'distributed',
    currentOwner: 'Green Valley Distributors',
    location: 'California, USA',
    transfers: [
      {
        id: 'T1',
        from: 'John Farmer',
        to: 'Green Valley Distributors',
        timestamp: '2024-01-16T10:00:00Z',
        location: 'California, USA',
        status: 'completed'
      }
    ]
  },
  {
    id: 'BTH002',
    cropType: 'Fresh Carrots',
    harvestDate: '2024-01-20',
    quantity: 50,
    price: 3.49,
    farmerId: '1',
    farmerName: 'John Farmer',
    status: 'harvested',
    currentOwner: 'John Farmer',
    location: 'California, USA',
    transfers: []
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [batches, setBatches] = useState<ProduceBatch[]>(initialBatches);

  const login = (email: string, password: string, role: string): boolean => {
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addBatch = (batchData: Omit<ProduceBatch, 'id' | 'transfers'>) => {
    const newBatch: ProduceBatch = {
      ...batchData,
      id: `BTH${String(batches.length + 1).padStart(3, '0')}`,
      transfers: []
    };
    setBatches(prev => [...prev, newBatch]);
  };

  const transferBatch = (batchId: string, to: string, location: string) => {
    setBatches(prev => prev.map(batch => {
      if (batch.id === batchId) {
        const newTransfer: Transfer = {
          id: `T${batch.transfers.length + 1}`,
          from: batch.currentOwner,
          to,
          timestamp: new Date().toISOString(),
          location,
          status: 'completed'
        };
        return {
          ...batch,
          currentOwner: to,
          transfers: [...batch.transfers, newTransfer],
          status: to.toLowerCase().includes('retail') ? 'retail' : 'distributed'
        };
      }
      return batch;
    }));
  };

  const getBatchById = (id: string): ProduceBatch | undefined => {
    return batches.find(batch => batch.id === id);
  };

  const updateBatchStatus = (batchId: string, status: ProduceBatch['status']) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId ? { ...batch, status } : batch
    ));
  };

  const value = {
    user,
    batches,
    login,
    logout,
    addBatch,
    transferBatch,
    getBatchById,
    updateBatchStatus
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};