import { supabase } from '@/integrations/supabase/client';

export async function createBatch(batch: any) {
  return supabase.from('batch_tracking').insert([batch]);
}
export async function getBatch(batch_id: string) {
  return supabase.from('batch_tracking').select('*').eq('batch_number', batch_id).single();
}
export async function updateBatch(batch_id: string, updates: any) {
  return supabase.from('batch_tracking').update(updates).eq('batch_number', batch_id);
}
export async function listBatches(farmer_id?: string) {
  const query = supabase.from('batch_tracking').select('*');
  return farmer_id ? query.eq('farmer_id', farmer_id) : query;
}
export async function addEventToBatch(batch_id: string, event: any) {
  const { data } = await getBatch(batch_id);
  const events = (data as any)?.transport_history || [];
  return updateBatch(batch_id, { transport_history: [...events, event] });
}
export async function getBatchJourney(batch_id: string) {
  const { data } = await getBatch(batch_id);
  return (data as any)?.transport_history || [];
}
