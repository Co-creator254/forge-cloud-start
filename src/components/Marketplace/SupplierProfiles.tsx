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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Award,
  TrendingUp,
  MessageSquare,
  Star,
  Heart,
} from 'lucide-react';
import { toast } from 'sonner';

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
  is_valid: boolean;
}

export interface SupplierProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  logo_url?: string;
  rating: number;
  total_reviews: number;
  verified: boolean;
  year_established: number;
  products_count: number;
  followers_count: number;
  response_time_hours: number;
  certifications: Certification[];
  created_at: string;
}

export interface SupplierProfilesProps {
  supplierId?: string;
  marketplace?: string;
  onContactSupplier?: (supplier: SupplierProfile) => void;
}

export interface SupplierStats {
  total_sales: number;
  avg_rating: number;
  on_time_delivery: number;
  customer_satisfaction: number;
  repeat_customer_rate: number;
}

export const SupplierProfiles: React.FC<SupplierProfilesProps> = ({
  supplierId,
  marketplace = 'farm-inputs',
  onContactSupplier,
}) => {
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProfile | null>(
    null
  );
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sendingContact, setSendingContact] = useState(false);

  useEffect(() => {
    if (supplierId) {
      fetchSupplierProfile(supplierId);
    } else {
      fetchSuppliers();
    }
  }, [supplierId]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('supplier_profiles')
        .select(
          `
          *,
          certifications:farm_certifications(*)
        `
        )
        .eq('marketplace', marketplace);

      if (filterVerified) {
        query = query.eq('verified', true);
      }

      let { data, error: err } = await query;

      if (err) throw err;

      // Filter by rating
      if (filterRating !== 'all') {
        data = data?.filter((s) => s.rating >= parseInt(filterRating)) || [];
      }

      // Filter by search term
      if (searchTerm) {
        data =
          data?.filter(
            (s) =>
              s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              s.location.toLowerCase().includes(searchTerm.toLowerCase())
          ) || [];
      }

      setSuppliers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suppliers');
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierProfile = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('supplier_profiles')
        .select(
          `
          *,
          certifications:farm_certifications(*)
        `
        )
        .eq('id', id)
        .single();

      if (err) throw err;

      setSelectedSupplier(data);

      // Fetch supplier stats
      const { data: statsData, error: statsErr } = await supabase
        .from('supplier_stats')
        .select('*')
        .eq('supplier_id', id)
        .single();

      if (!statsErr && statsData) {
        setStats(statsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load supplier');
      console.error('Error fetching supplier:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowSupplier = async () => {
    if (!selectedSupplier) return;

    try {
      const { error } = await supabase
        .from('supplier_followers')
        .insert([
          {
            supplier_id: selectedSupplier.id,
            follower_id: 'current-user-id', // Replace with actual user ID
          },
        ]);

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = duplicate key

      setIsFollowing(!isFollowing);
      toast.success(
        isFollowing ? 'Unfollowed supplier' : 'Following supplier now'
      );
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  const handleContactSupplier = async () => {
    if (!selectedSupplier || !contactEmail || !contactMessage) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSendingContact(true);

      const { error } = await supabase.from('supplier_inquiries').insert([
        {
          supplier_id: selectedSupplier.id,
          inquirer_email: contactEmail,
          message: contactMessage,
          marketplace: marketplace,
        },
      ]);

      if (error) throw error;

      toast.success('Message sent to supplier');
      setContactEmail('');
      setContactMessage('');

      if (onContactSupplier) {
        onContactSupplier(selectedSupplier);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSendingContact(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Loading suppliers...</div>
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

  // Detail view for selected supplier
  if (selectedSupplier) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setSelectedSupplier(null)}>
          ← Back to Suppliers
        </Button>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {selectedSupplier.logo_url && (
                  <img
                    src={selectedSupplier.logo_url}
                    alt={selectedSupplier.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>{selectedSupplier.name}</CardTitle>
                    {selectedSupplier.verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(selectedSupplier.rating)}
                    <span className="text-sm text-gray-600">
                      {selectedSupplier.rating.toFixed(1)} (
                      {selectedSupplier.total_reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant={isFollowing ? 'default' : 'outline'}
                onClick={handleFollowSupplier}
              >
                <Heart
                  size={16}
                  className={isFollowing ? 'fill-current' : ''}
                />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <span className="text-sm break-all">{selectedSupplier.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <span className="text-sm">{selectedSupplier.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm">{selectedSupplier.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-gray-500" />
                <span className="text-sm">Est. {selectedSupplier.year_established}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700">{selectedSupplier.description}</p>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">On-time Delivery</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.on_time_delivery}%
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Satisfaction Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.customer_satisfaction}%
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Repeat Customers</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.repeat_customer_rate}%
                  </p>
                </div>
              </div>
            )}

            {/* Certifications */}
            {selectedSupplier.certifications &&
              selectedSupplier.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Certifications</h3>
                  <div className="space-y-2">
                    {selectedSupplier.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-gray-600">
                            by {cert.issued_by}
                          </p>
                        </div>
                        <Badge
                          variant={cert.is_valid ? 'default' : 'secondary'}
                        >
                          {cert.is_valid ? 'Valid' : 'Expired'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Contact Form */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <MessageSquare size={16} />
                  Contact Supplier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Contact {selectedSupplier.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Your Email *</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message *</label>
                    <Input
                      as="textarea"
                      placeholder="Your message here..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <Button
                    onClick={handleContactSupplier}
                    disabled={sendingContact}
                    className="w-full"
                  >
                    {sendingContact ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Input
            placeholder="Search suppliers by name or location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              fetchSuppliers();
            }}
          />
          <div className="flex gap-2">
            <Button
              variant={filterVerified ? 'default' : 'outline'}
              onClick={() => {
                setFilterVerified(!filterVerified);
                fetchSuppliers();
              }}
            >
              Verified Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      {suppliers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              No suppliers found
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((supplier) => (
            <Card
              key={supplier.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedSupplier(supplier)}
            >
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{supplier.name}</h3>
                      {supplier.verified && (
                        <Badge variant="secondary">Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {supplier.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {renderStars(supplier.rating)}
                  <span className="text-sm text-gray-600">
                    {supplier.rating.toFixed(1)} (
                    {supplier.total_reviews})
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {supplier.description}
                </p>

                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div>
                    <Users size={14} className="mb-1" />
                    {supplier.followers_count} followers
                  </div>
                  <div>
                    <TrendingUp size={14} className="mb-1" />
                    {supplier.products_count} products
                  </div>
                  <div>
                    <Award size={14} className="mb-1" />
                    Est. {supplier.year_established}
                  </div>
                </div>

                <Button className="w-full text-xs" size="sm">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierProfiles;
