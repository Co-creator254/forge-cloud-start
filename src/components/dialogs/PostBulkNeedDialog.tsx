import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";

export function PostBulkNeedDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    quantity: "",
    max_price: "",
    deadline: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to post bulk needs.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('reverse_bulk_auctions')
        .insert({
          buyer_id: user.id,
          product_name: formData.product_name,
          description: formData.description,
          quantity: parseFloat(formData.quantity),
          max_price: parseFloat(formData.max_price),
          deadline: formData.deadline,
          location: formData.location,
          status: 'active',
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your bulk need has been posted successfully.",
      });
      
      setOpen(false);
      setFormData({
        product_name: "",
        description: "",
        quantity: "",
        max_price: "",
        deadline: "",
        location: "",
      });
      
      // Reload page to show new auction
      window.location.reload();
    } catch (error) {
      console.error('Error posting bulk need:', error);
      toast({
        title: "Error",
        description: "Failed to post bulk need. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Post Bulk Need</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Your Bulk Need</DialogTitle>
          <DialogDescription>
            Tell sellers what you need, and let them compete to offer you the best price.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="product_name">Product Name *</Label>
            <Input
              id="product_name"
              placeholder="e.g., Fresh Tomatoes"
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details about your requirement..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (units) *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="1000"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_price">Max Price (KES) *</Label>
              <Input
                id="max_price"
                type="number"
                placeholder="50000"
                value={formData.max_price}
                onChange={(e) => setFormData({ ...formData, max_price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Delivery Location *</Label>
            <Input
              id="location"
              placeholder="e.g., Nairobi, Kenya"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline *</Label>
            <div className="relative">
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Posting..." : "Post Bulk Need"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}