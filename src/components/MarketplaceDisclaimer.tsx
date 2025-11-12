import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MarketplaceDisclaimerProps {
  marketplaceType: 'equipment' | 'farm-inputs' | 'city-markets' | 'agricultural' | 'bulk-orders';
  onAccept?: () => void;
}

export const MarketplaceDisclaimer: React.FC<MarketplaceDisclaimerProps> = ({
  marketplaceType,
  onAccept
}) => {
  const [open, setOpen] = useState(true);
  const [accepted, setAccepted] = useState(false);

  const disclaimers = {
    equipment: {
      title: '⚠️ Equipment Marketplace - Important Disclaimer',
      content: [
        {
          title: '1. Buyer Responsibility',
          text: 'Always inspect equipment BEFORE purchase or rental. Verify seller credentials and business registration.'
        },
        {
          title: '2. Payment Security',
          text: 'NEVER send money before inspecting equipment. Use secure payment methods. Meet sellers in public places only.'
        },
        {
          title: '3. Equipment Verification',
          text: 'Verify equipment serial numbers, ownership documents, and that there are no outstanding loans on the equipment.'
        },
        {
          title: '4. Warranties & Insurance',
          text: 'Confirm warranty coverage in writing. Verify insurance for rental/lease equipment. Get signed agreements.'
        },
        {
          title: '5. Seller Verification',
          text: 'Check seller ratings, reviews, and credentials. Ask for references. Report suspicious sellers immediately.'
        },
        {
          title: '6. Safety Standards',
          text: 'Verify equipment meets Kenya safety standards. Get training if needed. Ensure proper maintenance records.'
        },
        {
          title: '7. Platform Liability',
          text: 'SokoConnect is a marketplace platform only. We are NOT responsible for: equipment condition, ownership disputes, transaction failures, accidents, or damages.'
        },
      ]
    },
    'farm-inputs': {
      title: '⚠️ Farm Inputs Marketplace - Important Disclaimer',
      content: [
        {
          title: '1. Product Quality',
          text: 'Inspect products BEFORE payment. Check packaging, expiry dates, and seals are intact.'
        },
        {
          title: '2. Certifications',
          text: 'Verify product certifications with relevant authorities (KEBS, PCPB). Ask for proof of certification.'
        },
        {
          title: '3. Supplier Verification',
          text: 'Check supplier ratings, business registration, and operating license. Request verifiable credentials.'
        },
        {
          title: '4. Product Storage',
          text: 'Store products per manufacturer specifications. Keep proof of purchase and quality reports.'
        },
        {
          title: '5. Organic Products',
          text: 'For organic claims, request certification numbers. Verify with certifying bodies independently.'
        },
        {
          title: '6. Legal Compliance',
          text: 'Ensure products comply with Kenya Food and Drug Authority (KFDA) and agricultural regulations.'
        },
        {
          title: '7. Platform Liability',
          text: 'SokoConnect is NOT responsible for: product defects, contamination, expired stock, false certifications, or crop failures resulting from product use.'
        },
      ]
    },
    'city-markets': {
      title: '⚠️ City Markets - Important Disclaimer',
      content: [
        {
          title: '1. Information Accuracy',
          text: 'Market information may not be current. Confirm directly with market management before visiting.'
        },
        {
          title: '2. Trading Hours',
          text: 'Hours may change seasonally or due to holidays. Call ahead to confirm before visiting.'
        },
        {
          title: '3. Facilities',
          text: 'Not all listed facilities are guaranteed to be available. Conditions may vary. Contact market directly for current status.'
        },
        {
          title: '4. Personal Safety',
          text: 'Exercise caution at markets. Keep valuables secure. Use assigned parking. Follow market security guidelines.'
        },
        {
          title: '5. Pricing',
          text: 'Prices shown are estimates only. Actual prices vary daily. Negotiate directly with traders.'
        },
        {
          title: '6. Health & Safety',
          text: 'Observe market hygiene standards. Check produce freshness. Follow food safety guidelines.'
        },
        {
          title: '7. Platform Liability',
          text: 'SokoConnect is NOT responsible for accidents, theft, injuries, or incidents at markets. Use at your own risk.'
        },
      ]
    },
    'agricultural': {
      title: '⚠️ Agricultural Marketplace - Important Disclaimer',
      content: [
        {
          title: '1. Product Authenticity',
          text: 'Verify farmer identity and product origin. Ask for farm location and visit if possible.'
        },
        {
          title: '2. Quality & Freshness',
          text: 'Product quality depends on farm practices and weather. Inspect before payment. No quality guarantees apply.'
        },
        {
          title: '3. Direct Transactions',
          text: 'SokoConnect facilitates connections only. All transactions are directly between buyer and farmer.'
        },
        {
          title: '4. Pesticide/Chemical Use',
          text: 'Ask farmers about chemicals used. Request spray records. Inspect for residues. Follow food safety guidelines.'
        },
        {
          title: '5. Delivery Terms',
          text: 'Agree on delivery terms BEFORE payment. Specify quality standards and quantity requirements in writing.'
        },
        {
          title: '6. Payment',
          text: 'Use secure payment methods. Never send money without first agreeing on terms and timeline.'
        },
        {
          title: '7. Platform Liability',
          text: 'SokoConnect is NOT responsible for product quality, delivery disputes, crop failures, or farmer credibility.'
        },
      ]
    },
    'bulk-orders': {
      title: '⚠️ Bulk Orders - Important Disclaimer',
      content: [
        {
          title: '1. Group Organization',
          text: 'Group organizers are responsible for coordinating with members and managing group dynamics.'
        },
        {
          title: '2. Payment Coordination',
          text: 'Carefully coordinate payments among group members. Create written agreements. Specify payment deadlines.'
        },
        {
          title: '3. Logistics',
          text: 'Group is responsible for coordinating delivery and logistics. Agree on transport arrangements and costs.'
        },
        {
          title: '4. Dispute Resolution',
          text: 'Resolve disputes within the group first. SokoConnect provides platform only and does NOT mediate disputes.'
        },
        {
          title: '5. Individual Responsibility',
          text: 'Each member is individually responsible for their share. Non-payment by one member may affect entire order.'
        },
        {
          title: '6. Verification',
          text: 'Verify supplier credentials and order details BEFORE committing. Get written quotes and terms.'
        },
        {
          title: '7. Platform Liability',
          text: 'SokoConnect is NOT responsible for: payment disputes, delivery failures, supplier credibility, or group conflicts.'
        },
      ]
    }
  };

  const disclaimer = disclaimers[marketplaceType];

  const handleAccept = () => {
    setAccepted(true);
    setOpen(false);
    if (onAccept) {
      onAccept();
    }
    // Store in localStorage so user isn't shown again this session
    localStorage.setItem(`disclaimer-${marketplaceType}`, 'accepted');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
            {disclaimer.title}
          </DialogTitle>
        </DialogHeader>

        {/* Disclaimer Content */}
        <div className="space-y-4">
          {disclaimer.content.map((section, idx) => (
            <div key={idx} className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded">
              <h3 className="font-semibold text-yellow-900 mb-1">{section.title}</h3>
              <p className="text-sm text-yellow-800">{section.text}</p>
            </div>
          ))}
        </div>

        {/* Important Notice Box */}
        <div className="bg-red-50 border-2 border-red-300 rounded p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-red-900 mb-1">⚠️ Important Legal Notice</p>
              <p className="text-red-800">
                By using this marketplace, you acknowledge that you have read and understood these terms. 
                You accept full responsibility for your transactions and agree that SokoConnect is a platform 
                facilitator only and is NOT liable for disputes, damages, or transaction failures.
              </p>
            </div>
          </div>
        </div>

        {/* Checkbox Acceptance */}
        <div className="flex items-start gap-3 bg-blue-50 p-4 rounded">
          <input
            type="checkbox"
            id="disclaimer-accept"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="disclaimer-accept" className="text-sm text-gray-700">
            I have read and understood the disclaimer. I accept full responsibility for my transactions 
            and agree to the terms above.
          </label>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Go Back
          </Button>
          <Button
            disabled={!accepted}
            onClick={handleAccept}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            I Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
