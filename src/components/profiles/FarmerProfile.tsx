import React, { useMemo, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import QRCode from "react-qr-code";
import { Download, QrCode, User, MapPin, Phone, Sprout } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface FarmerProfileData {
  name: string;
  location: string;
  contact: string;
  crops: string[];
  stockKg: number;
  connectedDistributors: string[];
}

const FarmerProfile: React.FC = () => {
  const { user } = useApp();
  const [profile, setProfile] = useState<FarmerProfileData>({
    name: user?.name || "",
    location: "California, USA",
    contact: "+1 555-0101",
    crops: ["Tomatoes", "Carrots"],
    stockKg: 120,
    connectedDistributors: ["Green Valley Distributors"],
  });

  const [qrSeed, setQrSeed] = useState<string>(uuidv4());

  const qrValue = useMemo(
    () =>
      JSON.stringify({
        type: "farmer-profile",
        userId: user?.id,
        seed: qrSeed,
        data: {
          name: profile.name,
          location: profile.location,
          crops: profile.crops,
          stockKg: profile.stockKg,
        },
      }),
    [qrSeed, user?.id, profile]
  );

  const handleUpdate = (updates: Partial<FarmerProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    setQrSeed(uuidv4());
  };

  const downloadRef = useRef<HTMLDivElement>(null);
  const handleDownloadQR = () => {
    const svg = downloadRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `farmer-profile-${user?.id}.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Manage your profile information
        </h2>
        <p className="text-gray-600 mt-2">
          Update your details and share your profile QR code with others
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Details */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Profile Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" /> Name
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  value={profile.name}
                  onChange={(e) => handleUpdate({ name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" /> Location
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  value={profile.location}
                  onChange={(e) => handleUpdate({ location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" /> Contact
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  value={profile.contact}
                  onChange={(e) => handleUpdate({ contact: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Current Stock (kg)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  value={profile.stockKg}
                  onChange={(e) =>
                    handleUpdate({ stockKg: Number(e.target.value || 0) })
                  }
                />
              </div>
            </div>
          </div>

          {/* Crops Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Crops Grown
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile.crops.map((c, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                >
                  <Sprout className="w-4 h-4 mr-1" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - QR Section */}
        <div className="space-y-6">
          <div
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center hover:shadow-lg transition"
            ref={downloadRef}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center justify-center">
              <QrCode className="w-5 h-5 mr-2 text-green-600" />
              Profile QR Code
            </h3>
            <div className="bg-gray-50 p-5 rounded-xl inline-block shadow-inner">
              <QRCode value={qrValue} size={180} />
            </div>
            <div className="mt-6">
              <button
                onClick={handleDownloadQR}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow transition"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Share this QR to let distributors view your profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
