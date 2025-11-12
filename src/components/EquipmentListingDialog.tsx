import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Loader2 } from 'lucide-react';

interface EquipmentListingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

interface ListingFormData {
  equipment_name: string;
  equipment_type: string;
  brand: string;
  model: string;
  year_manufactured: number;
  condition: string;
  location: string;
  county: string;
  description: string;
  specifications: string;
  tags: string;
  contact_phone: string;
  contact_email: string;
  // Sale Options
  sale_price: number;
  price_negotiable: boolean;
  // Rental Options
  rental_enabled: boolean;
  rental_price_per_day: number;
  minimum_rental_days: number;
  // Lease Options
  lease_enabled: boolean;
  lease_price_per_month: number;
  lease_terms: string;
  // Additional
  images: File[];
}

const EQUIPMENT_TYPES = [
  'Tractor', 'Plough', 'Harvester', 'Planter', 'Cultivator', 'Sprayer',
  'Irrigation Equipment', 'Generator', 'Water Pump', 'Thresher',
  'Disc Harrow', 'Mower', 'Baler', 'Transplanter', 'Other'
];

const CONDITIONS = ['New', 'Excellent', 'Good', 'Fair', 'Poor'];
const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Nyeri', 'Kiambu',
  'Muranga', 'Kericho', 'Bomet', 'Uasin Gishu', 'Trans Nzoia', 'Nandi',
  'Migori', 'Kisii', 'Homabay', 'Siaya', 'Bungoma', 'Busia', 'Vihiga',
  'Kakamega', 'Samburu', 'Isiolo', 'Laikipia', 'Embu', 'Tharaka Nithi',
  'Machakos', 'Makueni', 'Kajiado', 'Narok', 'Maasai', 'Kitui', 'Garissa',
  'Wajir', 'Mandera', 'Lamu', 'Taita Taveta', 'Kwale'
];

const EquipmentListingDialog: React.FC<EquipmentListingDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<ListingFormData>({
    equipment_name: '',
    equipment_type: 'Tractor',
    brand: '',
    model: '',
    year_manufactured: new Date().getFullYear(),
    condition: 'Good',
    location: '',
    county: 'Nairobi',
    description: '',
    specifications: '',
    tags: '',
    contact_phone: '',
    contact_email: '',
    sale_price: 0,
    price_negotiable: true,
    rental_enabled: false,
    rental_price_per_day: 0,
    minimum_rental_days: 1,
    lease_enabled: false,
    lease_price_per_month: 0,
    lease_terms: '12 months',
    images: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      toast({
        title: "Too Many Images",
        description: "Maximum 5 images allowed per listing",
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (formData.images.length === 0) return [];

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of formData.images) {
        const fileName = `${userId}/${Date.now()}-${file.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from('equipment-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('equipment-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrlData.publicUrl);
      }
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
      setUploadingImages(false);
      throw error;
    }

    setUploadingImages(false);
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.equipment_name || !formData.location || !formData.county) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      const imageUrls = await uploadImages();

      // Prepare specifications
      const specifications = formData.specifications
        ? JSON.parse(formData.specifications)
        : {};

      // Prepare listing data
      const listingData = {
        seller_id: userId,
        equipment_name: formData.equipment_name,
        equipment_type: formData.equipment_type,
        brand: formData.brand,
        model: formData.model,
        year_manufactured: formData.year_manufactured,
        condition: formData.condition,
        price: formData.sale_price,
        currency: 'KES',
        negotiable: formData.price_negotiable,
        location: formData.location,
        county: formData.county,
        description: formData.description,
        specifications,
        images: imageUrls,
        availability_status: 'available',
        rental_option: formData.rental_enabled,
        rental_price_per_day: formData.rental_price_per_day,
        rental_minimum_days: formData.minimum_rental_days,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        is_featured: false,
        view_count: 0,
      };

      // Insert into equipment_marketplace
      const { error: marketplaceError } = await supabase
        .from('equipment_marketplace')
        .insert(listingData);

      if (marketplaceError) throw marketplaceError;

      // Also insert into equipment_marketplace_listings for tracking
      const { error: listingsError } = await supabase
        .from('equipment_marketplace_listings')
        .insert({
          seller_id: userId,
          equipment_type: formData.equipment_type,
          brand: formData.brand,
          model: formData.model,
          location: formData.location,
          county: formData.county,
          sale_price: formData.sale_price,
          sale_available: true,
          rental_available: formData.rental_enabled,
          rental_price_per_day: formData.rental_price_per_day,
          lease_available: formData.lease_enabled,
          lease_price_per_month: formData.lease_price_per_month,
          lease_terms: formData.lease_terms,
          images: imageUrls,
          status: 'active',
        });

      if (listingsError) throw listingsError;

      toast({
        title: "Success!",
        description: "Equipment listing created successfully",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create listing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List Equipment for Sale or Rent</DialogTitle>
          <DialogDescription>
            Create a detailed listing to reach more buyers and renters
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="sale">Sale</TabsTrigger>
              <TabsTrigger value="rental">Rental</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="equipment_name">Equipment Name *</Label>
                <Input
                  id="equipment_name"
                  name="equipment_name"
                  placeholder="e.g., John Deere 5045D Tractor"
                  value={formData.equipment_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipment_type">Equipment Type *</Label>
                  <select
                    id="equipment_type"
                    name="equipment_type"
                    value={formData.equipment_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    {EQUIPMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {CONDITIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    placeholder="e.g., John Deere"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="e.g., 5045D"
                    value={formData.model}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="year_manufactured">Year Manufactured</Label>
                <Input
                  id="year_manufactured"
                  name="year_manufactured"
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={formData.year_manufactured}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Town/City"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="county">County *</Label>
                  <select
                    id="county"
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    {COUNTIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of equipment condition, features, and any issues"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="specifications">Specifications (JSON)</Label>
                <Textarea
                  id="specifications"
                  name="specifications"
                  placeholder='{"horsepower": "45 HP", "fuel_type": "Diesel"}'
                  value={formData.specifications}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="e.g., hydraulic, 4WD, low hours, serviced"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    type="tel"
                    placeholder="+254..."
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Sale Tab */}
            <TabsContent value="sale" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <p className="text-sm text-blue-900">
                  Set your equipment sale price and negotiation options
                </p>
              </div>

              <div>
                <Label htmlFor="sale_price">Sale Price (KES) *</Label>
                <Input
                  id="sale_price"
                  name="sale_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="price_negotiable"
                  name="price_negotiable"
                  checked={formData.price_negotiable}
                  onChange={handleInputChange}
                />
                <Label htmlFor="price_negotiable" className="mb-0">
                  Price is negotiable
                </Label>
              </div>

              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm font-semibold text-green-900 mb-2">💡 Sale Tips:</p>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Use competitive pricing for faster sales</li>
                  <li>• Enable negotiation for better customer engagement</li>
                  <li>• Add detailed specifications to increase trust</li>
                  <li>• Clear photos significantly improve inquiries</li>
                </ul>
              </div>
            </TabsContent>

            {/* Rental & Lease Tab */}
            <TabsContent value="rental" className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h3 className="font-semibold text-sm mb-2">Rental Options</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      id="rental_enabled"
                      name="rental_enabled"
                      checked={formData.rental_enabled}
                      onChange={handleInputChange}
                    />
                    <Label htmlFor="rental_enabled" className="mb-0">
                      Enable Rental Service
                    </Label>
                  </div>

                  {formData.rental_enabled && (
                    <div className="space-y-3 bg-orange-50 p-3 rounded">
                      <div>
                        <Label htmlFor="rental_price_per_day">
                          Daily Rental Rate (KES)
                        </Label>
                        <Input
                          id="rental_price_per_day"
                          name="rental_price_per_day"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.rental_price_per_day}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="minimum_rental_days">
                          Minimum Rental Days
                        </Label>
                        <Input
                          id="minimum_rental_days"
                          name="minimum_rental_days"
                          type="number"
                          min="1"
                          value={formData.minimum_rental_days}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h3 className="font-semibold text-sm mb-2">Lease Options</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      id="lease_enabled"
                      name="lease_enabled"
                      checked={formData.lease_enabled}
                      onChange={handleInputChange}
                    />
                    <Label htmlFor="lease_enabled" className="mb-0">
                      Enable Lease Service
                    </Label>
                  </div>

                  {formData.lease_enabled && (
                    <div className="space-y-3 bg-purple-50 p-3 rounded">
                      <div>
                        <Label htmlFor="lease_price_per_month">
                          Monthly Lease Rate (KES)
                        </Label>
                        <Input
                          id="lease_price_per_month"
                          name="lease_price_per_month"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.lease_price_per_month}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lease_terms">Lease Terms</Label>
                        <select
                          id="lease_terms"
                          name="lease_terms"
                          value={formData.lease_terms}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="3 months">3 months</option>
                          <option value="6 months">6 months</option>
                          <option value="12 months">12 months</option>
                          <option value="24 months">24 months</option>
                          <option value="36 months">36 months</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-md">
                <p className="text-sm font-semibold text-amber-900 mb-2">💼 Rental/Lease Tips:</p>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Daily rates for short-term usage (1-30 days)</li>
                  <li>• Monthly rates for longer-term commitment</li>
                  <li>• Set minimum rental days to ensure profitability</li>
                  <li>• Include maintenance responsibilities in lease terms</li>
                </ul>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <p className="text-sm text-blue-900">
                  Upload up to 5 high-quality images of your equipment
                </p>
              </div>

              {previewUrls.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="mb-2 text-sm">
                    Drag and drop images here or click to select
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById('image-upload')?.click()
                      }
                    >
                      Select Images
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: JPG, PNG, WebP (Max 5MB each)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {previewUrls.length < 5 && (
                    <div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload-more"
                      />
                      <label htmlFor="image-upload-more">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById('image-upload-more')?.click()
                          }
                        >
                          Add More Images ({previewUrls.length}/5)
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Submit Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || uploadingImages}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadingImages}
            >
              {loading || uploadingImages ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploadingImages ? 'Uploading Images...' : 'Creating Listing...'}
                </>
              ) : (
                'Create Listing'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentListingDialog;
