import React, { useState } from 'react';
import { LogIn, User, Mail, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'farmer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(formData.email, formData.password, formData.role);
    
    if (success) {
      onNavigate('dashboard');
    } else {
      setError('Invalid credentials. Use demo123 as password.');
    }
    
    setLoading(false);
  };

  const handleDemoLogin = (role: string, email: string) => {
    setFormData({ email, password: 'demo123', role });
    login(email, 'demo123', role);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your FarmSetu account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="farmer">Farmer</option>
                  <option value="distributor">Distributor/Retailer</option>
                  <option value="consumer">Consumer</option>
                  <option value="retailer">Retailer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="text-center text-sm text-gray-600 mb-4">
              Or try demo accounts:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleDemoLogin('farmer', 'farmer@demo.com')}
                className="bg-green-100 text-green-700 px-3 py-2 rounded font-medium hover:bg-green-200 transition-colors"
              >
                Demo Farmer
              </button>
              <button
                onClick={() => handleDemoLogin('distributor', 'distributor@demo.com')}
                className="bg-blue-100 text-blue-700 px-3 py-2 rounded font-medium hover:bg-blue-200 transition-colors"
              >
                Demo Distributor
              </button>
              <button
                onClick={() => handleDemoLogin('consumer', 'consumer@demo.com')}
                className="bg-orange-100 text-orange-700 px-3 py-2 rounded font-medium hover:bg-orange-200 transition-colors"
              >
                Demo Consumer
              </button>
              <button
                onClick={() => handleDemoLogin('retailer', 'retailer@demo.com')}
                className="bg-purple-100 text-purple-700 px-3 py-2 rounded font-medium hover:bg-purple-200 transition-colors"
              >
                Demo Retailer
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => onNavigate('home')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;