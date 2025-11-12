import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  Check,
  AlertCircle,
  Calendar,
  Download,
  Shield,
  Verified,
} from 'lucide-react';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_KEY || ''
);

export interface Certification {
  id: string;
  name: string;
  issued_by: string;
  issue_date: string;
  expiry_date: string;
  certificate_url?: string;
  is_valid: boolean;
  verified: boolean;
}

export interface CertificationDisplayProps {
  productId?: string;
  supplierId?: string;
  marketplace?: string;
  compactView?: boolean;
}

export const CertificationDisplay: React.FC<CertificationDisplayProps> = ({
  productId,
  supplierId,
  marketplace = 'agricultural',
  compactView = false,
}) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    expiring_soon: 0,
    expired: 0,
  });

  useEffect(() => {
    fetchCertifications();
  }, [productId, supplierId]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('certifications')
        .select('*')
        .order('expiry_date', { ascending: true });

      if (productId) {
        query = query.eq('product_id', productId);
      } else if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      }

      const { data, error: err } = await query;

      if (err) throw err;

      const certs = data || [];
      setCertifications(certs);

      // Calculate stats
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      let valid = 0;
      let expiring_soon = 0;
      let expired = 0;

      certs.forEach((cert) => {
        const expiry = new Date(cert.expiry_date);

        if (expiry < now) {
          expired++;
        } else if (expiry < thirtyDaysFromNow) {
          expiring_soon++;
        } else {
          valid++;
        }
      });

      setStats({
        total: certs.length,
        valid,
        expiring_soon,
        expired,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load certifications'
      );
      console.error('Error fetching certifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (cert: Certification) => {
    if (!cert.is_valid) return 'text-red-600';
    const expiry = new Date(cert.expiry_date);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (expiry < now) return 'text-red-600';
    if (expiry < thirtyDaysFromNow) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = (cert: Certification) => {
    if (!cert.is_valid) {
      return <AlertCircle className="text-red-600" size={20} />;
    }

    const expiry = new Date(cert.expiry_date);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (expiry < now) {
      return <AlertCircle className="text-red-600" size={20} />;
    }

    if (expiry < thirtyDaysFromNow) {
      return <AlertCircle className="text-yellow-600" size={20} />;
    }

    return <Check className="text-green-600" size={20} />;
  };

  const getStatusBadge = (cert: Certification) => {
    if (!cert.is_valid) {
      return <Badge variant="destructive">Invalid</Badge>;
    }

    const expiry = new Date(cert.expiry_date);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (expiry < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    if (expiry < thirtyDaysFromNow) {
      return <Badge variant="secondary">Expiring Soon</Badge>;
    }

    return <Badge variant="default">Valid</Badge>;
  };

  const daysUntilExpiry = (cert: Certification) => {
    const expiry = new Date(cert.expiry_date);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            Loading certifications...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-700">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (certifications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">No certifications</div>
        </CardContent>
      </Card>
    );
  }

  // Compact view
  if (compactView) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-center gap-1">
              {getStatusIcon(cert)}
              <span className="text-sm font-medium">{cert.name}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 text-xs">
          {stats.valid > 0 && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              {stats.valid} Valid
            </Badge>
          )}
          {stats.expiring_soon > 0 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {stats.expiring_soon} Expiring
            </Badge>
          )}
          {stats.expired > 0 && (
            <Badge variant="destructive">
              {stats.expired} Expired
            </Badge>
          )}
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-600">Valid</p>
            <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-600">Expiring</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.expiring_soon}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-600">Expired</p>
            <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
          </CardContent>
        </Card>
      </div>

      {/* Certifications List */}
      <div className="space-y-3">
        {certifications.map((cert) => (
          <Card key={cert.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(cert)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{cert.name}</h3>
                      {cert.verified && (
                        <Verified size={16} className="text-blue-600" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600">
                      Issued by: {cert.issued_by}
                    </p>

                    <div className="flex items-center gap-4 text-sm mt-2">
                      <span className="text-gray-600">
                        Issued: {new Date(cert.issue_date).toLocaleDateString()}
                      </span>
                      <span className="text-gray-600">
                        Expires:{' '}
                        {new Date(cert.expiry_date).toLocaleDateString()}
                      </span>
                    </div>

                    {cert.is_valid && (
                      <p className="text-sm text-gray-600 mt-1">
                        Days until expiry: {daysUntilExpiry(cert)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(cert)}
                  {cert.certificate_url && (
                    <Button variant="outline" size="sm">
                      <Download size={14} />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust Indicators */}
      {stats.valid === stats.total && stats.total > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 flex items-center gap-3">
            <Shield className="text-green-600" size={24} />
            <div>
              <p className="font-semibold text-green-900">
                All Certifications Valid
              </p>
              <p className="text-sm text-green-700">
                This seller/product meets all certification requirements
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {stats.expired > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <p className="font-semibold text-red-900">
                Expired Certifications
              </p>
              <p className="text-sm text-red-700">
                {stats.expired} certification(s) have expired. Please verify status
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {stats.expiring_soon > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="text-yellow-600" size={24} />
            <div>
              <p className="font-semibold text-yellow-900">
                Certifications Expiring Soon
              </p>
              <p className="text-sm text-yellow-700">
                {stats.expiring_soon} certification(s) will expire within 30 days
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CertificationDisplay;
