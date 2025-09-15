import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'react-qr-code';
import { Download, QrCode, User, MapPin, Phone, Building2, Upload, Eye, Send, Scan, Shield, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ReportItem {
  id: string;
  title: string;
  type: 'compliance' | 'safety' | 'pricing' | 'quality';
  uploadedAt: string;
  qrSeed: string;
  relatedBatchId?: string;
  status: 'draft' | 'published';
  findings: string;
}

interface RegulatorProfileData {
  name: string;
  dept: string;
  location: string;
  contact: string;
  reports: ReportItem[];
}

interface VerificationResult {
  batchId: string;
  complianceScore: number;
  issues: string[];
  recommendations: string[];
  verified: boolean;
}

const RegulatorProfile: React.FC = () => {
  const { user } = useApp();
  const [profile, setProfile] = useState<RegulatorProfileData>({
    name: user?.name || '',
    dept: 'Food Safety Department',
    location: 'Washington, USA',
    contact: '+1 555-0303',
    reports: [
      {
        id: 'RPT001',
        title: 'Organic Certification Audit',
        type: 'compliance',
        uploadedAt: '2024-01-20',
        qrSeed: uuidv4(),
        status: 'published',
        findings: 'All organic standards met. Certificate valid.'
      }
    ]
  });

  const [qrSeed, setQrSeed] = useState<string>(uuidv4());
  const [showAddReport, setShowAddReport] = useState(false);
  const [showQRModal, setShowQRModal] = useState<ReportItem | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const [newReport, setNewReport] = useState({
    title: '',
    type: 'compliance' as const,
    findings: '',
    relatedBatchId: ''
  });

  const qrValue = useMemo(() => (
    JSON.stringify({ 
      type: 'regulator-profile', 
      userId: user?.id, 
      seed: qrSeed, 
      data: { 
        name: profile.name, 
        dept: profile.dept,
        location: profile.location,
        contact: profile.contact
      } 
    })
  ), [qrSeed, user?.id, profile]);

  const handleUpdate = (updates: Partial<RegulatorProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setQrSeed(uuidv4());
  };

  const addReport = () => {
    if (!newReport.title || !newReport.findings) return;
    
    const report: ReportItem = {
      id: `RPT${String(profile.reports.length + 1).padStart(3, '0')}`,
      title: newReport.title,
      type: newReport.type,
      uploadedAt: new Date().toISOString().split('T')[0],
      qrSeed: uuidv4(),
      relatedBatchId: newReport.relatedBatchId || undefined,
      status: 'published',
      findings: newReport.findings
    };
    
    setProfile(prev => ({ ...prev, reports: [...prev.reports, report] }));
    setNewReport({ title: '', type: 'compliance', findings: '', relatedBatchId: '' });
    setShowAddReport(false);
    setQrSeed(uuidv4());
  };

  const verifyBatch = (batchData: any) => {
    // Simulate batch verification logic
    let score = 70;
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check journey completeness
    if (batchData.data?.journey?.length > 2) {
      score += 15;
    } else {
      issues.push('Incomplete supply chain documentation');
      recommendations.push('Ensure all transfer stages are properly documented');
    }

    // Check storage conditions
    if (batchData.data?.storageCondition) {
      score += 10;
    } else {
      issues.push('Storage conditions not specified');
      recommendations.push('Add storage condition details for food safety compliance');
    }

    // Check organic certification
    if (batchData.data?.cropType?.toLowerCase().includes('organic')) {
      score += 5;
    }

    const result: VerificationResult = {
      batchId: batchData.batchId || batchData.originalBatchId || 'Unknown',
      complianceScore: Math.min(score, 100),
      issues,
      recommendations,
      verified: score >= 80
    };

    setVerificationResult(result);
  };

  const handleScan = () => {
    try {
      const data = JSON.parse(scanInput);
      setScanResult(data);
      
      // If it's a batch QR, automatically verify it
      if (data.type === 'farmer-batch' || data.type === 'distributor-batch') {
        verifyBatch(data);
        setShowVerifyModal(true);
      }
    } catch (e) {
      setScanResult({ error: 'Invalid QR code format' });
    }
  };

  const getReportQRValue = (report: ReportItem) => {
    return JSON.stringify({
      type: 'regulator-report',
      reportId: report.id,
      regulatorId: user?.id,
      regulatorName: profile.name,
      seed: report.qrSeed,
      data: {
        title: report.title,
        type: report.type,
        uploadedAt: report.uploadedAt,
        findings: report.findings,
        relatedBatchId: report.relatedBatchId,
        department: profile.dept,
        contact: profile.contact
      }
    });
  };

  const downloadRef = useRef<HTMLDivElement>(null);
  const handleDownloadQR = (isProfile = true, report?: ReportItem) => {
    const svg = downloadRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = isProfile ? `regulator-profile-${user?.id}.png` : `report-${report?.id}.png`;
      a.click();
    };
    img.src = url;
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'compliance': return <Shield className="w-4 h-4" />;
      case 'safety': return <AlertTriangle className="w-4 h-4" />;
      case 'pricing': return <FileText className="w-4 h-4" />;
      case 'quality': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'compliance': return 'bg-green-100 text-green-800';
      case 'safety': return 'bg-red-100 text-red-800';
      case 'pricing': return 'bg-blue-100 text-blue-800';
      case 'quality': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Regulator Profile</h2>
        <p className="text-gray-600">Verify batches, manage reports, and ensure compliance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulator Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><User className="w-4 h-4 mr-2"/>Name</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.name} onChange={(e) => handleUpdate({ name: e.target.value })}/>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><Building2 className="w-4 h-4 mr-2"/>Department</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.dept} onChange={(e) => handleUpdate({ dept: e.target.value })}/>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><MapPin className="w-4 h-4 mr-2"/>Location</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.location} onChange={(e) => handleUpdate({ location: e.target.value })}/>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 flex items-center"><Phone className="w-4 h-4 mr-2"/>Contact</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.contact} onChange={(e) => handleUpdate({ contact: e.target.value })}/>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Compliance Reports</h3>
              <button onClick={() => setShowAddReport(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
                <Upload className="w-4 h-4 mr-2"/>Add Report
              </button>
            </div>
            
            <div className="space-y-3">
              {profile.reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>
                          {getReportTypeIcon(report.type)}
                          <span className="ml-1">{report.type}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">ID: {report.id} | Uploaded: {report.uploadedAt}</p>
                      <p className="text-sm text-gray-500">{report.findings}</p>
                      {report.relatedBatchId && (
                        <p className="text-sm text-blue-600">Related Batch: {report.relatedBatchId}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowQRModal(report)} className="text-blue-600 hover:text-blue-700 flex items-center">
                        <Eye className="w-4 h-4 mr-1"/>View QR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setShowScanModal(true)} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Scan className="w-5 h-5 text-purple-600 mr-3"/>
                <span className="font-medium">Scan & Verify Batch</span>
              </button>
              <button onClick={() => setShowAddReport(true)} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Upload className="w-5 h-5 text-green-600 mr-3"/>
                <span className="font-medium">Upload Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile QR */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6" ref={downloadRef}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <QrCode className="w-5 h-5 mr-2"/>Profile QR Code
            </h3>
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCode value={qrValue} size={180} />
            </div>
            <div className="mt-4">
              <button onClick={() => handleDownloadQR(true)} className="inline-flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg text-sm">
                <Download className="w-4 h-4 mr-1"/>Download QR
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share this QR for identity verification</p>
          </div>
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Report</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={newReport.title} onChange={(e) => setNewReport({...newReport, title: e.target.value})} placeholder="e.g., Organic Certification Audit"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2" value={newReport.type} onChange={(e) => setNewReport({...newReport, type: e.target.value as any})}>
                  <option value="compliance">Compliance</option>
                  <option value="safety">Safety</option>
                  <option value="pricing">Pricing</option>
                  <option value="quality">Quality</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Batch ID (Optional)</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={newReport.relatedBatchId} onChange={(e) => setNewReport({...newReport, relatedBatchId: e.target.value})} placeholder="e.g., FB001"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Findings</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} value={newReport.findings} onChange={(e) => setNewReport({...newReport, findings: e.target.value})} placeholder="Enter your findings and recommendations..."/>
              </div>
              <div className="flex gap-3">
                <button onClick={addReport} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Add Report</button>
                <button onClick={() => setShowAddReport(false)} className="flex-1 border border-gray-300 py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6" ref={downloadRef}>
            <h3 className="text-lg font-semibold mb-4">Report QR Code - {showQRModal.id}</h3>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block">
                <QRCode value={getReportQRValue(showQRModal)} size={200} />
              </div>
              <div className="mt-4 space-y-2">
                <button onClick={() => handleDownloadQR(false, showQRModal)} className="w-full bg-gray-800 text-white py-2 rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2"/>Download Report QR
                </button>
                <button onClick={() => setShowQRModal(null)} className="w-full border border-gray-300 py-2 rounded-lg">Close</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Share this QR to distribute the report</p>
            </div>
          </div>
        </div>
      )}

      {/* Scan QR Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Scan & Verify Batch</h3>
            <div className="space-y-4">
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={4} value={scanInput} onChange={(e) => setScanInput(e.target.value)} placeholder="Paste batch QR code content here..."/>
              <button onClick={handleScan} className="w-full bg-blue-600 text-white py-2 rounded-lg">Scan & Verify</button>
              
              {scanResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Scan Result:</h4>
                  {scanResult.error ? (
                    <p className="text-red-600">{scanResult.error}</p>
                  ) : (
                    <div>
                      <p className="text-green-600 mb-2">✓ Batch scanned successfully!</p>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">{JSON.stringify(scanResult, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
              
              <button onClick={() => {setShowScanModal(false); setScanResult(null); setScanInput('');}} className="w-full border border-gray-300 py-2 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Result Modal */}
      {showVerifyModal && verificationResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Batch Verification Result</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Batch ID:</span>
                <span>{verificationResult.batchId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Compliance Score:</span>
                <span className={`font-bold ${verificationResult.complianceScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {verificationResult.complianceScore}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded-full text-sm ${verificationResult.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {verificationResult.verified ? 'Verified' : 'Needs Review'}
                </span>
              </div>
              
              {verificationResult.issues.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Issues Found:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-red-700">
                    {verificationResult.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {verificationResult.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Recommendations:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                    {verificationResult.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button onClick={() => {setShowVerifyModal(false); setVerificationResult(null);}} className="w-full bg-blue-600 text-white py-2 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatorProfile;