import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode, Shield, Users, Award, CheckCircle2, Smartphone, Printer, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowTrustPassportWorks: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: QrCode,
      title: "Generate Your QR Code",
      description: "Go to your profile and click 'My QR Code' to generate your unique Trust Passport QR code.",
      details: "Each QR code contains your verified profile information and is cryptographically signed to prevent tampering."
    },
    {
      icon: Printer,
      title: "Display Your QR Code",
      description: "Print your QR code and display it at your farm, shop, or market stall.",
      details: "Buyers can easily scan your QR code to verify your identity and trust level instantly."
    },
    {
      icon: Users,
      title: "Get Scanned by Buyers",
      description: "When buyers scan your QR code, they can verify your profile and award you trust points.",
      details: "Each scan earns you 1 trust point and builds your reputation in the SokoConnect community."
    },
    {
      icon: Award,
      title: "Build Trust & Reputation",
      description: "Accumulate trust points to level up and unlock more opportunities.",
      details: "Higher trust levels lead to better market access, premium prices, and increased buyer confidence."
    }
  ];

  const benefits = [
    {
      icon: CheckCircle2,
      title: "Instant Verification",
      description: "Buyers can verify your identity in seconds without paperwork"
    },
    {
      icon: Shield,
      title: "Fraud Prevention",
      description: "Cryptographic signatures prevent QR code tampering"
    },
    {
      icon: Users,
      title: "Community Trust",
      description: "Build reputation through peer verification and trust points"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Works on any smartphone with camera - no special apps needed"
    }
  ];

  const features = [
    {
      icon: Share2,
      title: "Share Digitally",
      description: "Share your QR code via WhatsApp, SMS, or social media"
    },
    {
      icon: Printer,
      title: "Print & Display",
      description: "Print physical copies for your farm, shop, or market stall"
    },
    {
      icon: Smartphone,
      title: "Save to Phone",
      description: "Download directly to your phone gallery for easy access"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full">
                <QrCode className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Trust Passport QR System
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Build trust and grow your business with SokoConnect's digital identity system. 
              Your QR code is your passport to better market opportunities.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-2">{step.description}</p>
                  <p className="text-sm text-gray-500">{step.details}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Benefits */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Trust Passport Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <benefit.icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">QR Code Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Security Info */}
        <Card className="p-6 mb-8 bg-yellow-50 border-yellow-200">
          <div className="flex gap-4">
            <Shield className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Security & Privacy</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• QR codes are cryptographically signed to prevent tampering</li>
                <li>• Only public profile information is shared (no sensitive data)</li>
                <li>• Rate limiting prevents abuse (1 scan per QR per day)</li>
                <li>• All scans are logged for transparency and dispute resolution</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/profile')}
            className="bg-green-600 hover:bg-green-700"
          >
            <QrCode className="h-5 w-5 mr-2" />
            Generate Your Trust Passport Now
          </Button>
          <p className="mt-4 text-sm text-gray-600">
            Start building trust and accessing better market opportunities today
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowTrustPassportWorks;
