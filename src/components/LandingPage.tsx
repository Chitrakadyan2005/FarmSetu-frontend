import React from 'react';
import { ChevronRight, Shield, Truck, Leaf, Users, CheckCircle, QrCode } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <header
  className="relative bg-cover bg-center min-h-[90vh]"
  style={{ backgroundImage: "url('../landingpage/wallpaper.jpg')" }}
>
  {/* Overlay for better readability */}
  <div className="absolute inset-0 bg-black/10"></div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
    <div className="text-center text-white">
      
      {/* Logo */}
      <img 
        src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/e729fb74-4401-4bed-8c19-fc292200680a.png" 
        alt="FarmSetu Logo" 
        className="mx-auto mb-6 w-24 sm:w-32" 
      />

      <h1 className="text-4xl sm:text-6xl font-bold mb-6">
        <span className="text-green-800">FarmSetu</span>
        <br />
        <span className="text-3xl sm:text-4xl">Transparent Food Supply</span>
      </h1>
      
      <p className="text-xl mb-8 max-w-3xl mx-auto">
        Track your food from farm to fork with blockchain technology.
        Ensuring transparency, authenticity, and trust in every bite.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onNavigate("login")}
          className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          Get Started
          <ChevronRight className="ml-2 w-5 h-5" />
        </button>
        <button className="border border-green-400 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-50/20 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  </div>
</header>



      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our blockchain-powered platform creates an immutable record of your food's journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Farm</h3>
              <p className="text-gray-600">Farmers record harvest details and create batch IDs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Distribute</h3>
              <p className="text-gray-600">Distributors track transfers and logistics</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Retail</h3>
              <p className="text-gray-600">Retailers manage inventory with full traceability</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Consume</h3>
              <p className="text-gray-600">Consumers scan QR codes to see the complete journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits for Everyone</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <Users className="w-5 h-5 text-green-600 mr-2" />
                    For Farmers
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Prove authenticity and quality
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Access premium markets
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Build consumer trust
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    For Consumers
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Know your food's origin
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Verify organic claims
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Make informed choices
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Ready to Join?</h3>
              <p className="text-gray-600 mb-6">
                Choose your role and start experiencing transparent food supply chains today.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
                >
                  Farmer Login
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Distributor
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors text-center"
                >
                  Consumer
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
                >
                  Regulator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 FarmSetu. Revolutionizing food transparency with blockchain technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;