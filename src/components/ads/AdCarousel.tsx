import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Ad {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  business_name: string;
  business_category: string;
  cta_text?: string;
  cta_link?: string;
}

interface AdCarouselProps {
  slotName: string;
  className?: string;
  variant?: 'banner' | 'inline' | 'compact';
}

export const AdCarousel: React.FC<AdCarouselProps> = ({ 
  slotName, 
  className = '',
  variant = 'inline' 
}) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAds();
  }, [slotName]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  const loadAds = async () => {
    try {
      // Get slot
      const { data: slot } = await supabase
        .from('ad_placements')
        .select('id')
        .eq('slot_name', slotName)
        .eq('is_active', true)
        .single();

      if (!slot) {
        setLoading(false);
        return;
      }

      // Get assigned ads
      const { data: assignments } = await supabase
        .from('ad_slot_assignments')
        .select('advertisement_id, display_order')
        .eq('slot_id', slot.id)
        .eq('is_active', true)
        .order('display_order');

      if (!assignments || assignments.length === 0) {
        setLoading(false);
        return;
      }

      // Get ad details
      const adIds = assignments.map(a => a.advertisement_id);
      const { data: adData } = await supabase
        .from('business_advertisements')
        .select('id, title, description, image_url, business_name, business_category, cta_text, cta_link')
        .in('id', adIds)
        .eq('is_active', true)
        .eq('payment_status', 'paid');

      if (adData) {
        setAds(adData);
        // Track views
        adData.forEach(ad => {
          supabase
            .from('business_advertisements')
            .select('views_count')
            .eq('id', ad.id)
            .single()
            .then(({ data }) => {
              if (data) {
                supabase
                  .from('business_advertisements')
                  .update({ views_count: (data.views_count || 0) + 1 })
                  .eq('id', ad.id)
                  .then(() => {});
              }
            });
        });
      }
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (ad: Ad) => {
    // Track click
    const { data } = await supabase
      .from('business_advertisements')
      .select('clicks_count')
      .eq('id', ad.id)
      .single();

    if (data) {
      await supabase
        .from('business_advertisements')
        .update({ clicks_count: (data.clicks_count || 0) + 1 })
        .eq('id', ad.id);
    }

    if (ad.cta_link) {
      if (ad.cta_link.startsWith('http')) {
        window.open(ad.cta_link, '_blank');
      } else {
        navigate(ad.cta_link);
      }
    }
  };

  if (loading || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg border border-accent">
          <Badge variant="outline" className="text-xs shrink-0 gap-1">
            <Megaphone className="h-3 w-3" />
            Ad
          </Badge>
          <span className="text-sm font-medium truncate">{currentAd.title}</span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="ml-auto shrink-0 text-xs"
            onClick={() => handleAdClick(currentAd)}
          >
            Learn More
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-2 border-yellow-400/50"
        onClick={() => handleAdClick(currentAd)}
      >
        <div className="flex flex-col md:flex-row">
          {currentAd.image_url && (
            <div className="md:w-1/3 h-40 md:h-auto">
              <img 
                src={currentAd.image_url} 
                alt={currentAd.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={`p-4 flex-1 ${!currentAd.image_url ? 'w-full' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs gap-1 bg-yellow-100 text-yellow-800">
                <Megaphone className="h-3 w-3" />
                Sponsored
              </Badge>
              <Badge variant="outline" className="text-xs">{currentAd.business_category}</Badge>
            </div>
            <h3 className="font-bold text-lg mb-1">{currentAd.title}</h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{currentAd.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">by {currentAd.business_name}</span>
              {currentAd.cta_text && (
                <Button size="sm" variant="default">
                  {currentAd.cta_text}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Carousel controls */}
      {ads.length > 1 && (
        <>
          <div className="absolute top-1/2 -translate-y-1/2 left-1 z-10">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              onClick={(e) => { 
                e.stopPropagation(); 
                setCurrentIndex(prev => (prev - 1 + ads.length) % ads.length); 
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-1 z-10">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              onClick={(e) => { 
                e.stopPropagation(); 
                setCurrentIndex(prev => (prev + 1) % ads.length); 
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {ads.map((_, idx) => (
              <button
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'
                }`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};