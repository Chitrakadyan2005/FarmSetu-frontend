import React, { useState } from 'react';
import { Package, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AddBatchFormProps {
  onSuccess: () => void;
}

const AddBatchForm: React.FC<AddBatchFormProps> = ({ onSuccess }) => {
  const { user, addBatch } = useApp();
  const [formData, setFormData] = useState({
    cropType: '',
    harvestDate: '',
    quantity: '',
    price: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const batchData = {
      cropType: formData.cropType,
      harvestDate: formData.harvestDate,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      farmerId: user!.id,
      farmerName: user!.name,
      status: 'harvested' as const,
      currentOwner: user!.name,
      location: formData.location
    };

    addBatch(batchData);
    setLoading(false);
    onSuccess();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Package className="w-4 h-4 inline mr-1" />
          Crop Type
        </label>
        <select
          name="cropType"
          value={formData.cropType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          <option value="">Select crop type</option>
          <option value="Organic Tomatoes">Organic Tomatoes</option>
          <option value="Fresh Carrots">Fresh Carrots</option>
          <option value="Organic Lettuce">Organic Lettuce</option>
          <option value="Bell Peppers">Bell Peppers</option>
          <option value="Organic Potatoes">Organic Potatoes</option>
          <option value="Fresh Spinach">Fresh Spinach</option>
          <option value="Organic Broccoli">Organic Broccoli</option>
          <option value="Sweet Corn">Sweet Corn</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Harvest Date
        </label>
        <input
          type="date"
          name="harvestDate"
          value={formData.harvestDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity (kg)
        </label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter quantity in kilograms"
          min="1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="w-4 h-4 inline mr-1" />
          Price per kg (₹)
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter price per kilogram"
          min="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Farm Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter farm location (e.g., Punjab, India)"
          required
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Batch...' : 'Create Batch'}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Once created, your batch will be assigned a unique Batch ID and recorded on the blockchain for complete traceability.
        </p>
      </div>
    </form>
  );
};

export default AddBatchForm;