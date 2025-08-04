import { useAuth } from '@/components/AuthProvider';

export const useUser = () => {
  const { user } = useAuth();
  return { user };
};