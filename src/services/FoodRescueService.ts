// FoodRescueService: Handles CRUD and matching for food rescue listings and rescue matches
import { supabase } from '@/integrations/supabase/client';

export async function createFoodRescueListing(listing: any) {
  return supabase.from('food_rescue_listings').insert(listing).select();
}

export async function getFoodRescueListings(filter = {}) {
  return supabase.from('food_rescue_listings').select('*').match(filter);
}

export async function updateFoodRescueListing(id: string, updates: any) {
  return supabase.from('food_rescue_listings').update(updates).eq('id', id).select();
}

export async function deleteFoodRescueListing(id: string) {
  return supabase.from('food_rescue_listings').delete().eq('id', id);
}

export async function createRescueMatch(match: any) {
  return supabase.from('rescue_matches').insert(match).select();
}

export async function getRescueMatches(filter = {}) {
  return supabase.from('rescue_matches').select('*').match(filter);
}

export async function updateRescueMatch(id: string, updates: any) {
  return supabase.from('rescue_matches').update(updates).eq('id', id).select();
}

export async function updateRescueMatchStatus(matchId: string, status: string) {
  return supabase.from('rescue_matches').update({ status }).eq('id', matchId).select();
}
