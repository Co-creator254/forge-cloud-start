import { supabase } from '@/integrations/supabase/client';

export async function createPost(post: any) {
  return supabase.from('carbon_forum_posts').insert([post]);
}
export async function getPost(id: string) {
  return supabase.from('carbon_forum_posts').select('*').eq('id', id).single();
}
export async function updatePost(id: string, updates: any) {
  return supabase.from('carbon_forum_posts').update(updates).eq('id', id);
}
export async function deletePost(id: string) {
  return supabase.from('carbon_forum_posts').delete().eq('id', id);
}
export async function listPosts(type?: string) {
  const query = supabase.from('carbon_forum_posts').select('*');
  return type ? query.eq('type', type) : query;
}
