
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRIVACY_CONFIG, CONTENT_RATING } from '@/config/privacy';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy - AgriTender Connect</CardTitle>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Data We Collect</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Personal Information</h3>
                <p className="text-sm text-muted-foreground">
                  {PRIVACY_CONFIG.dataCollection.personalInfo.purpose}
                </p>
                <ul className="list-disc list-inside text-sm">
                  {PRIVACY_CONFIG.dataCollection.personalInfo.types.map(type => (
                    <li key={type}>{type.replace('_', ' ').toUpperCase()}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Usage Data</h3>
                <p className="text-sm text-muted-foreground">
                  {PRIVACY_CONFIG.dataCollection.usage.purpose}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Location Data</h3>
                <p className="text-sm text-muted-foreground">
                  {PRIVACY_CONFIG.dataCollection.location.purpose}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Audio Data</h3>
                <p className="text-sm text-muted-foreground">
                  {PRIVACY_CONFIG.dataCollection.audio.purpose}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Security Measures</h2>
            <ul className="space-y-2 text-sm">
              <li><strong>Encryption:</strong> {PRIVACY_CONFIG.security.encryption}</li>
              <li><strong>Transmission:</strong> {PRIVACY_CONFIG.security.transmission}</li>
              <li><strong>Storage:</strong> {PRIVACY_CONFIG.security.storage}</li>
              <li><strong>Authentication:</strong> {PRIVACY_CONFIG.security.authentication}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
            <p className="text-sm">
              For privacy concerns or data requests, contact us at:
              <br />
              Email: privacy@agritender.co.ke
              <br />
              Phone: +254 700 000 000
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
