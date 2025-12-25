// ImperfectSurplusService: Handles CRUD for imperfect surplus produce
import { supabase } from '@/integrations/supabase/client';

export async function createImperfectSurplusProduce(produce: any) {
  return supabase.from('imperfect_surplus_produce').insert(produce).select();
}
export async function getImperfectSurplusProduce(filter = {}) {
  return supabase.from('imperfect_surplus_produce').select('*').match(filter);
}
export async function updateImperfectSurplusProduce(id: string, updates: any) {
  return supabase.from('imperfect_surplus_produce').update(updates).eq('id', id).select();
}
export async function deleteImperfectSurplusProduce(id: string) {
  return supabase.from('imperfect_surplus_produce').delete().eq('id', id);
}
