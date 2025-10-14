
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const DiscussionHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartDiscussion = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start a new discussion.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    toast({
      title: "Coming Soon",
      description: "Discussion creation form will be available soon.",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quality Control Discussions</h1>
        <p className="text-muted-foreground mt-2">
          Join the conversation on agricultural quality standards and challenges
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <Button onClick={handleStartDiscussion}>
          <PenSquare className="mr-2 h-4 w-4" /> Start New Discussion
        </Button>
      </div>
    </div>
  );
};
