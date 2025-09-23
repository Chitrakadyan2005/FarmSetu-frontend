import React from 'react';
import { ChevronRight, Shield, Truck, Leaf, Users, CheckCircle, QrCode } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <header
  className="relative bg-cover bg-center h-screen"
  style={{ backgroundImage: "url('https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')" }}
>
  {/* Overlay for better readability */}
  <div className="absolute inset-0 bg-black/30"></div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
    <div className="text-center text-white w-full">
      
      {/* Logo */}
      <img 
        src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/e729fb74-4401-4bed-8c19-fc292200680a.png" 
        alt="FarmSetu Logo" 
        className="mx-auto mb-8 w-32 sm:w-48 md:w-56 drop-shadow-2xl"
        style={{ 
          filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.3))',
        }}
        loading="eager"
        fetchpriority="high"
      />

      <h1 className="text-4xl sm:text-6xl font-bold mb-6" style={{ 
        fontFamily: "'Poppins', sans-serif", 
        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
        letterSpacing: '-0.02em',
        fontWeight: '800'
      }}>
        <span className="text-green-400" style={{ 
          textShadow: '0 4px 8px rgba(0,0,0,0.4)'
        }}>FarmSetu</span>
        <br />
        <span className="text-3xl sm:text-4xl text-white" style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontWeight: '700', 
          letterSpacing: '0.08em',
          textShadow: '0 4px 8px rgba(0,0,0,0.5)'
        }}>Linking Farm to Fork</span>
      </h1>
      
      <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-50" style={{ 
        fontFamily: "'Inter', sans-serif", 
        fontWeight: '400', 
        lineHeight: '1.8',
        letterSpacing: '0.01em',
        textShadow: '0 2px 4px rgba(0,0,0,0.6)'
      }}>
        Track your food from farm to fork with blockchain technology.
        Ensuring transparency, authenticity, and trust in every bite.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onNavigate("login")}
          className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 border border-green-500"
          style={{ 
            fontFamily: "'Poppins', sans-serif",
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%)',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          Get Started
          <ChevronRight className="ml-2 w-5 h-5" />
        </button>
        <button 
          onClick={scrollToHowItWorks}
          className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          style={{ 
            fontFamily: "'Poppins', sans-serif",
            backdropFilter: 'blur(5px)',
            background: 'rgba(255, 255, 255, 0)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          Learn More
        </button>
      </div>
    </div>
  </div>
</header>



      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Our blockchain-powered platform creates an immutable record of your food's journey
            </p>
          </div>
          
          {/* Visual Journey Flowchart */}
          <div className="relative">
            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between relative">
                {/* Step 1: Farmer */}
                <div className="flex flex-col items-center z-10 bg-white">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
                         style={{ 
                           boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3), 0 0 20px rgba(34, 197, 94, 0.1)',
                           filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))'
                         }}>
                      <Leaf className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"
                         style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)' }}></div>
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-bold text-xl mb-2 text-green-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      🌱 Farmer
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Harvest fresh produce and create blockchain records with batch IDs
                    </p>
                  </div>
                </div>

                {/* Arrow 1 */}
                <div className="flex-1 relative mx-4">
                  <svg className="w-full h-16" viewBox="0 0 200 60" fill="none">
                    <defs>
                      <linearGradient id="arrow1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <path d="M10 30 Q100 10 180 30" stroke="url(#arrow1)" strokeWidth="3" fill="none" className="animate-pulse" />
                    <polygon points="175,25 185,30 175,35" fill="#3b82f6" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                    Transfer
                  </div>
                </div>

                {/* Step 2: Distributor */}
                <div className="flex flex-col items-center z-10 bg-white">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
                         style={{ 
                           boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.1)',
                           filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))'
                         }}>
                      <Truck className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-pulse"
                         style={{ boxShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}></div>
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-bold text-xl mb-2 text-blue-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      🚚 Distributor
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Handle logistics and maintain cold chain with real-time tracking
                    </p>
                  </div>
                </div>

                {/* Arrow 2 */}
                <div className="flex-1 relative mx-4">
                  <svg className="w-full h-16" viewBox="0 0 200 60" fill="none">
                    <defs>
                      <linearGradient id="arrow2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                    <path d="M10 30 Q100 50 180 30" stroke="url(#arrow2)" strokeWidth="3" fill="none" className="animate-pulse" />
                    <polygon points="175,25 185,30 175,35" fill="#f97316" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                    Deliver
                  </div>
                </div>

                {/* Step 3: Retailer */}
                <div className="flex flex-col items-center z-10 bg-white">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
                         style={{ 
                           boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3), 0 0 20px rgba(249, 115, 22, 0.1)',
                           filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.4))'
                         }}>
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full animate-pulse"
                         style={{ boxShadow: '0 0 10px rgba(251, 146, 60, 0.6)' }}></div>
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-bold text-xl mb-2 text-orange-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      🏪 Retailer
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Stock shelves with full traceability and quality assurance
                    </p>
                  </div>
                </div>

                {/* Arrow 3 */}
                <div className="flex-1 relative mx-4">
                  <svg className="w-full h-16" viewBox="0 0 200 60" fill="none">
                    <defs>
                      <linearGradient id="arrow3" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <path d="M10 30 Q100 10 180 30" stroke="url(#arrow3)" strokeWidth="3" fill="none" className="animate-pulse" />
                    <polygon points="175,25 185,30 175,35" fill="#8b5cf6" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                    Purchase
                  </div>
                </div>

                {/* Step 4: Consumer */}
                <div className="flex flex-col items-center z-10 bg-white">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
                         style={{ 
                           boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.1)',
                           filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))'
                         }}>
                      <QrCode className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full animate-pulse"
                         style={{ boxShadow: '0 0 10px rgba(196, 181, 253, 0.6)' }}></div>
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-bold text-xl mb-2 text-purple-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      👤 Consumer
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Scan QR codes to discover the complete farm-to-fork journey
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
              <div className="space-y-8">
                {/* Step 1: Farmer */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg"
                         style={{ 
                           boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
                           filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.4))'
                         }}>
                      <Leaf className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-pulse"
                         style={{ boxShadow: '0 0 8px rgba(251, 191, 36, 0.6)' }}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 text-green-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      🌱 Farmer
                    </h3>
                    <p className="text-gray-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Harvest fresh produce and create blockchain records
                    </p>
                  </div>
                </div>

                {/* Mobile Arrow */}
                <div className="flex justify-center">
                  <svg className="w-8 h-12" viewBox="0 0 32 48" fill="none">
                    <defs>
                      <linearGradient id="mobileArrow1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <path d="M16 4 L16 36" stroke="url(#mobileArrow1)" strokeWidth="3" className="animate-pulse" />
                    <polygon points="12,32 16,40 20,32" fill="#3b82f6" />
                  </svg>
                </div>

                {/* Step 2: Distributor */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg"
                         style={{ 
                           boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                           filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))'
                         }}>
                      <Truck className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-400 rounded-full animate-pulse"
                         style={{ boxShadow: '0 0 8px rgba(96, 165, 250, 0.6)' }}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 text-blue-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      🚚 Distributor
                    </h3>
                    <p className="text-gray-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Handle logistics and maintain cold chain tracking
                    </p>
                  </div>
                </div>

                {/* Mobile Arrow */}
                <div className="flex justify-center">
                  <svg className="w-8 h-12" viewBox="0 0 32 48" fill="none">
                    <defs>
                      <linearGradient id="mobileArrow2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                    <path d="M16 4 L16 36" stroke="url(#mobileArrow2)" strokeWidth="3" className="animate-pulse" />
                    <polygon points="12,32 16,40 20,32" fill="#f97316" />
                  </svg>
                </div>

                {/* Step 3: Retailer */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg"
                         style={{ 
                           boxShadow: '0 8px 25px rgba(249, 115, 22, 0.3)',
                           filter: 'drop-shadow(0 0 6px rgba(249, 115, 22, 0.4))'
                         }}>
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 rounded-full animate-pulse"
                         style={{ boxShadow: '0 0 8px rgba(251, 146, 60, 0.6)' }}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 text-orange-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      🏪 Retailer
                    </h3>
                    <p className="text-gray-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Stock shelves with full traceability and quality assurance
                    </p>
                  </div>
                </div>

                {/* Mobile Arrow */}
                <div className="flex justify-center">
                  <svg className="w-8 h-12" viewBox="0 0 32 48" fill="none">
                    <defs>
                      <linearGradient id="mobileArrow3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <path d="M16 4 L16 36" stroke="url(#mobileArrow3)" strokeWidth="3" className="animate-pulse" />
                    <polygon points="12,32 16,40 20,32" fill="#8b5cf6" />
                  </svg>
                </div>

                {/* Step 4: Consumer */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg"
                         style={{ 
                           boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                           filter: 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.4))'
                         }}>
                      <QrCode className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-400 rounded-full animate-pulse"
                         style={{ boxShadow: '0 0 8px rgba(196, 181, 253, 0.6)' }}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 text-purple-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      👤 Consumer
                    </h3>
                    <p className="text-gray-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Scan QR codes to discover the complete farm-to-fork journey
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-orange-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-1/4 right-1/3 w-14 h-14 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                 style={{ 
                   boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                   filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.2))'
                 }}>
              <span style={{ fontFamily: "'Poppins', sans-serif" }}>Experience the Journey</span>
              <ChevronRight className="ml-2 w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Benefits for Everyone</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Users className="w-5 h-5 text-green-600 mr-2" />
                    For Farmers
                  </h3>
                  <ul className="space-y-2 text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                  <h3 className="font-semibold text-lg mb-2 flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    For Consumers
                  </h3>
                  <ul className="space-y-2 text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Know your food's origin
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Verify quality and safety
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Make informed choices
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" 
                alt="Fresh vegetables and fruits" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Transform Your Food Journey?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Join thousands of farmers, distributors, retailers, and consumers who trust FarmSetu for complete food traceability.
          </p>
          <button
            onClick={() => onNavigate("login")}
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Get Started Today
          </button>
        </div>
      </footer>
    </div>
  );
};