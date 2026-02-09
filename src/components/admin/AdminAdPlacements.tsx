import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Plus, Trash2, GripVertical, LayoutGrid } from 'lucide-react';

interface AdPlacement {
  id: string;
  slot_name: string;
  slot_label: string;
  page_route: string;
  position: string;
  max_ads: number;
  is_active: boolean;
}

interface AdAssignment {
  id: string;
  slot_id: string;
  advertisement_id: string;
  display_order: number;
  is_active: boolean;
  ad_title?: string;
  ad_business?: string;
}

interface Advertisement {
  id: string;
  title: string;
  business_name: string;
  payment_status: string;
  is_active: boolean;
}

export const AdminAdPlacements: React.FC = () => {
  const [placements, setPlacements] = useState<AdPlacement[]>([]);
  const [assignments, setAssignments] = useState<Record<string, AdAssignment[]>>({});
  const [availableAds, setAvailableAds] = useState<Advertisement[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedAd, setSelectedAd] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load all placements
      const { data: slots } = await supabase
        .from('ad_placements')
        .select('*')
        .order('page_route');

      if (slots) setPlacements(slots);

      // Load all paid active ads
      const { data: ads } = await supabase
        .from('business_advertisements')
        .select('id, title, business_name, payment_status, is_active')
        .eq('payment_status', 'paid')
        .eq('is_active', true);

      if (ads) setAvailableAds(ads);

      // Load all assignments
      if (slots) {
        const assignmentMap: Record<string, AdAssignment[]> = {};
        for (const slot of slots) {
          const { data: slotAssignments } = await supabase
            .from('ad_slot_assignments')
            .select('*')
            .eq('slot_id', slot.id)
            .order('display_order');

          if (slotAssignments) {
            // Enrich with ad data
            const enriched = await Promise.all(
              slotAssignments.map(async (a) => {
                const { data: ad } = await supabase
                  .from('business_advertisements')
                  .select('title, business_name')
                  .eq('id', a.advertisement_id)
                  .single();
                return {
                  ...a,
                  ad_title: ad?.title || 'Unknown',
                  ad_business: ad?.business_name || 'Unknown'
                };
              })
            );
            assignmentMap[slot.id] = enriched;
          }
        }
        setAssignments(assignmentMap);
      }
    } catch (error) {
      console.error('Error loading ad placements:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSlot = async (slotId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('ad_placements')
      .update({ is_active: isActive })
      .eq('id', slotId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update slot', variant: 'destructive' });
    } else {
      setPlacements(prev => prev.map(p => p.id === slotId ? { ...p, is_active: isActive } : p));
      toast({ title: 'Updated', description: `Slot ${isActive ? 'activated' : 'deactivated'}` });
    }
  };

  const assignAd = async () => {
    if (!selectedSlot || !selectedAd) return;

    const currentAssignments = assignments[selectedSlot] || [];
    const slot = placements.find(p => p.id === selectedSlot);
    
    if (slot && currentAssignments.length >= slot.max_ads) {
      toast({ 
        title: 'Slot Full', 
        description: `This slot can hold max ${slot.max_ads} ads`,
        variant: 'destructive' 
      });
      return;
    }

    const { error } = await supabase
      .from('ad_slot_assignments')
      .insert({
        slot_id: selectedSlot,
        advertisement_id: selectedAd,
        display_order: currentAssignments.length,
        is_active: true
      });

    if (error) {
      toast({ title: 'Error', description: 'Failed to assign ad', variant: 'destructive' });
    } else {
      toast({ title: 'Ad Assigned', description: 'Advertisement added to slot' });
      setSelectedAd('');
      loadData();
    }
  };

  const removeAssignment = async (assignmentId: string) => {
    const { error } = await supabase
      .from('ad_slot_assignments')
      .delete()
      .eq('id', assignmentId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to remove ad', variant: 'destructive' });
    } else {
      toast({ title: 'Removed', description: 'Ad removed from slot' });
      loadData();
    }
  };

  if (loading) {
    return <div className="animate-pulse p-4">Loading ad placements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LayoutGrid className="h-6 w-6" />
            Ad Placement Management
          </h2>
          <p className="text-muted-foreground">
            Choose where paid business ads appear across the platform
          </p>
        </div>
      </div>

      {/* Assign Ad Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Assign Ad to Slot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedSlot} onValueChange={setSelectedSlot}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose ad slot..." />
              </SelectTrigger>
              <SelectContent>
                {placements.map(slot => (
                  <SelectItem key={slot.id} value={slot.id}>
                    {slot.slot_label} ({slot.page_route})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAd} onValueChange={setSelectedAd}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose advertisement..." />
              </SelectTrigger>
              <SelectContent>
                {availableAds.map(ad => (
                  <SelectItem key={ad.id} value={ad.id}>
                    {ad.title} - {ad.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={assignAd} disabled={!selectedSlot || !selectedAd}>
              <Plus className="h-4 w-4 mr-2" />
              Assign
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Placement Slots Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {placements.map(slot => (
          <Card key={slot.id} className={!slot.is_active ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" />
                    {slot.slot_label}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Route: {slot.page_route} • Position: {slot.position} • Max: {slot.max_ads}
                  </p>
                </div>
                <Switch 
                  checked={slot.is_active} 
                  onCheckedChange={(checked) => toggleSlot(slot.id, checked)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(assignments[slot.id] || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No ads assigned</p>
                ) : (
                  (assignments[slot.id] || []).map(assignment => (
                    <div 
                      key={assignment.id} 
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{assignment.ad_title}</p>
                          <p className="text-xs text-muted-foreground">{assignment.ad_business}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={assignment.is_active ? 'default' : 'secondary'} className="text-xs">
                          {assignment.is_active ? 'Active' : 'Paused'}
                        </Badge>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7"
                          onClick={() => removeAssignment(assignment.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};