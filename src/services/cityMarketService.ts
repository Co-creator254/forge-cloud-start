// Update the import path if necessary, or create the file if missing
import { supabase } from '../lib/supabaseClient';
import { Database } from '../integrations/supabase/types';

// Types
export type CityMarketLike = Database['public']['Tables']['city_market_likes']['Row'];
export type CityMarketRating = Database['public']['Tables']['city_market_ratings']['Row'];
export type CityMarketComment = Database['public']['Tables']['city_market_comments']['Row'];
export type CityMarketFlag = Database['public']['Tables']['city_market_flags']['Row'];
export type CityMarketBanRecommendation = Database['public']['Tables']['city_market_ban_recommendations']['Row'];
export type CityMarketProduct = Database['public']['Tables']['city_market_products']['Row'];
export type CityMarketAuction = Database['public']['Tables']['city_market_auctions']['Row'];
export type CityMarketBid = Database['public']['Tables']['city_market_bids']['Row'];
export type Agent = Database['public']['Tables']['agents']['Row'];

// Engagement
export async function likeCityMarket(market_id: string, user_id: string) {
  const { data, error } = await supabase.from('city_market_likes').insert({ market_id, user_id });
  return { data, error };
}

export async function rateCityMarket(market_id: string, user_id: string, rating: number, comment?: string) {
  const { data, error } = await supabase.from('city_market_ratings').insert({ market_id, user_id, rating, comment });
  return { data, error };
}

export async function commentCityMarket(market_id: string, user_id: string, comment: string) {
  const { data, error } = await supabase.from('city_market_comments').insert({ market_id, user_id, comment });
  return { data, error };
}

export async function flagCityMarket(market_id: string, user_id: string, reason: string) {
  const { data, error } = await supabase.from('city_market_flags').insert({ market_id, user_id, reason });
  return { data, error };
}

export async function recommendBanCityMarket(market_id: string, user_id: string, reason: string) {
  const { data, error } = await supabase.from('city_market_ban_recommendations').insert({ market_id, user_id, reason });
  return { data, error };
}

// Seller Products
export async function addCityMarketProduct(product: Omit<CityMarketProduct, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('city_market_products').insert(product);
  return { data, error };
}

// Edit product
export async function editCityMarketProduct(product_id: string, updates: Partial<CityMarketProduct>) {
  const { data, error } = await supabase.from('city_market_products').update(updates).eq('id', product_id);
  return { data, error };
}

// Delete product
export async function deleteCityMarketProduct(product_id: string) {
  const { data, error } = await supabase.from('city_market_products').delete().eq('id', product_id);
  return { data, error };
}

// Set product category (e.g., 'imperfect', 'surplus', 'standard')
export async function setCityMarketProductCategory(product_id: string, category: 'imperfect' | 'surplus' | 'standard') {
  const { data, error } = await supabase.from('city_market_products').update({ category }).eq('id', product_id);
  return { data, error };
}

// Get products by category
export async function getCityMarketProductsByCategory(category: string) {
  const { data, error } = await supabase.from('city_market_products').select('*').eq('category', category);
  return { data, error };
}

// Recipients (children's homes, food banks, charities)
export async function addRecipient(recipient: { name: string; type: string; location?: string; contact?: string }) {
  const { data, error } = await supabase.from('recipients').insert(recipient);
  return { data, error };
}

export async function getRecipients(type?: string) {
  let query = supabase.from('recipients').select('*');
  if (type) query = query.eq('type', type);
  const { data, error } = await query;
  return { data, error };
}

export async function deleteRecipient(recipient_id: string) {
  const { data, error } = await supabase.from('recipients').delete().eq('id', recipient_id);
  return { data, error };
}

// Update product status (e.g., fresh, near expiry, spoilt)
export async function updateCityMarketProductStatus(product_id: string, status: 'fresh' | 'near_expiry' | 'spoilt') {
  const { data, error } = await supabase.from('city_market_products').update({ status }).eq('id', product_id);
  return { data, error };
}

// Donate product to a children's home
export async function donateCityMarketProduct(product_id: string, home_id: string, agent_id: string) {
  // Assumes a donations table exists: city_market_donations
  const { data, error } = await supabase.from('city_market_donations').insert({ product_id, home_id, agent_id });
  if (!error) {
    // Optionally mark product as donated
    await supabase.from('city_market_products').update({ status: 'donated' }).eq('id', product_id);
  }
  return { data, error };
}

export async function getCityMarketProducts(market_id: string) {
  const { data, error } = await supabase.from('city_market_products').select('*').eq('market_id', market_id);
  return { data, error };
}

// Auctions
export async function createCityMarketAuction(auction: Omit<CityMarketAuction, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('city_market_auctions').insert(auction);
  return { data, error };
}

export async function placeCityMarketBid(bid: Omit<CityMarketBid, 'id' | 'bid_time'>) {
  const { data, error } = await supabase.from('city_market_bids').insert(bid);
  return { data, error };
}

export async function getCityMarketAuctions(market_id: string) {
  const { data, error } = await supabase
    .from('city_market_auctions')
    .select('*, product:city_market_products(*)')
    .in('product.market_id', [market_id]);
  return { data, error };
}

// Agents
export async function addAgent(agent: Omit<Agent, 'id' | 'created_at' | 'verified'>) {
  const { data, error } = await supabase.from('agents').insert(agent);
  return { data, error };
}

export async function verifyAgent(agent_id: string) {
  const { data, error } = await supabase.from('agents').update({ verified: true }).eq('id', agent_id);
  return { data, error };
}

export async function getAgents(market_id?: string) {
  let query = supabase.from('agents').select('*');
  if (market_id) query = query.eq('market_id', market_id);
  const { data, error } = await query;
  return { data, error };
}

// Moderation
export async function getFlaggedCityMarkets() {
  const { data, error } = await supabase.from('city_market_flags').select('*');
  return { data, error };
}

export async function getBanRecommendations() {
  const { data, error } = await supabase.from('city_market_ban_recommendations').select('*');
  return { data, error };
}
