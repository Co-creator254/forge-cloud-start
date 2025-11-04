import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminRole = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke('check-admin-role');
        
        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.isAdmin || false);
        }
      } catch (error) {
        console.error('Failed to check admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  return { isAdmin, loading };
};
