import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  QrCode,
  Scan,
  Eye,
  Search,
  CheckCircle,
  Clock,
  ShoppingCart,
  Store,
  Users,
  Camera
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import JourneyModal from '../common/JourneyModal';

interface RetailerDashboardProps {
  currentPage: string;
}

interface InventoryItem {
  id: string;
  batchId: string;
  product: string;
  quantity: number;
  price: number;
  supplier: string;
  receivedDate: string;
  expiryDate: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

// Dummy inventory data
const dummyInventory: InventoryItem[] = [
  {
    id: 'INV001',
    batchId: 'BTH001',
    product: 'Organic Tomatoes',
    quantity: 45,
    price: 45,
    supplier: 'Mumbai Fresh Distributors',
    receivedDate: '2024-01-17',
    expiryDate: '2024-01-24',
    status: 'in-stock'
  },
  {
    id: 'INV002',
    batchId: 'BTH002',
    product: 'Fresh Carrots',
    quantity: 8,
    price: 25,
    supplier: 'Rajesh Sharma',
    receivedDate: '2024-01-22',
    expiryDate: '2024-01-29',
    status: 'low-stock'
  },
  {
    id: 'INV003',
    batchId: 'BTH003',
    product: 'Organic Lettuce',
    quantity: 25,
    price: 25,
    supplier: 'Haryana Green Farm',
    receivedDate: '2024-01-25',
    expiryDate: '2024-01-30',
    status: 'in-stock'
  }
];

const RetailerDashboard: React.FC<RetailerDashboardProps> = ({ currentPage }) => {
  const { batches } = useApp();
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>(dummyInventory);
  const [showCamera, setShowCamera] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleScan = () => {
    try {
      const data = JSON.parse(scanInput);
      setScanResult(data);
    } catch (e) {
      setScanResult({ error: 'Invalid QR code format' });
    }
  };

  const openCamera = () => {
    setShowCamera(true);
    setTimeout(() => {
      alert('Camera would open here in a real app. For demo, please use the input field.');
      setShowCamera(false);
    }, 1000);
  };

  const getItemQRValue = (item: InventoryItem) => {
    return JSON.stringify({
      type: 'retailer-inventory',
      itemId: item.id,
      batchId: item.batchId,
      data: item
    });
  };

  const getItemJourney = (item: InventoryItem) => {
    return [
      {
        stage: 'Farm Origin',
        handler: 'Rajesh Sharma',
        location: 'Punjab, India',
        timestamp: '2024-01-15',
        details: `Harvested ${item.product}`
      },
      {
        stage: 'Distribution Center',
        handler: item.supplier,
        location: 'Maharashtra, India',
        timestamp: '2024-01-16',
        details: 'Quality checked and packaged'
      },
      {
        stage: 'Retail Store',
        handler: 'Kirana Fresh Store',
        location: 'Mumbai, India',
        timestamp: item.receivedDate,
        details: 'Received and stocked for sale'
      }
    ];
  };

  if (currentPage === 'inventory') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Store Inventory</h2>
          <p className="text-gray-600">Manage your product inventory and stock levels</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-purple-600" />
            Search Inventory
          </h3>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter Product name or Batch ID to search"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Current Inventory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.product}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.batchId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.quantity} units</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{item.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.supplier}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center hover:underline"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Actions
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {inventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No inventory items found</p>
            </div>
          )}
        </div>

        {/* Journey Modal */}
        {selectedItem && (
          <JourneyModal
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            batch={{
              id: selectedItem.batchId,
              cropType: selectedItem.product,
              price: selectedItem.price,
              quantity: selectedItem.quantity,
              harvestDate: selectedItem.receivedDate,
              location: 'Oregon, USA'
            }}
            journey={getItemJourney(selectedItem)}
            qrValue={getItemQRValue(selectedItem)}
            title={`Inventory Actions - ${selectedItem.product}`}
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
          Welcome back, Suresh Store! 🏪
        </h2>
        <p className="text-gray-600 mb-8">Here's an overview of your store activity.</p>
      </div>

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
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
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
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.filter(item => item.status === 'in-stock').length}
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
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.filter(item => item.status === 'low-stock').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Package className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium">Manage Inventory</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Users className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-medium">Customer Orders</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium">Sales Analytics</span>
          </motion.button>
        </div>
      </motion.div>

      {/* QR Scanner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <QrCode className="w-5 h-5 mr-2" />
          Product Scanner with ML Insights
        </h3>
        <p className="text-gray-600 mb-4">Scan QR codes on food packages to trace their complete journey and verify authenticity.</p>
        <div className="flex space-x-2 items-center">
          <button
            onClick={openCamera}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan
          </button>
          <span className="text-gray-500">OR</span>
          <input
            type="text"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Type Batch ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleScan}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        
        {scanResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg"
          >
            <h4 className="font-medium mb-2">Scan Result:</h4>
            {scanResult.error ? (
              <p className="text-red-600">{scanResult.error}</p>
            ) : (
              <div className="text-sm text-gray-700">
                <p><strong>Product:</strong> {scanResult.data?.cropType || 'Unknown'}</p>
                <p><strong>Batch ID:</strong> {scanResult.batchId || 'Unknown'}</p>
                <p><strong>Supplier:</strong> {scanResult.data?.farmerName || 'Unknown'}</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RetailerDashboard;