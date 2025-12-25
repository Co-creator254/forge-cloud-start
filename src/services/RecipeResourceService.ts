// RecipeResourceService: Handles CRUD for recipes, resources, and workshops
import { supabase } from '@/integrations/supabase/client';

// Recipes
export async function createRecipe(recipe: any) {
  return supabase.from('recipes').insert(recipe).select();
}
export async function getRecipes(filter = {}) {
  return supabase.from('recipes').select('*').match(filter);
}
export async function updateRecipe(id: string, updates: any) {
  return supabase.from('recipes').update(updates).eq('id', id).select();
}
export async function deleteRecipe(id: string) {
  return supabase.from('recipes').delete().eq('id', id);
}

// Resources
export async function createResource(resource: any) {
  return supabase.from('resources').insert(resource).select();
}
export async function getResources(filter = {}) {
  return supabase.from('resources').select('*').match(filter);
}
export async function updateResource(id: string, updates: any) {
  return supabase.from('resources').update(updates).eq('id', id).select();
}
export async function deleteResource(id: string) {
  return supabase.from('resources').delete().eq('id', id);
}

// Workshops
export async function createWorkshop(workshop: any) {
  return supabase.from('workshops').insert(workshop).select();
}
export async function getWorkshops(filter = {}) {
  return supabase.from('workshops').select('*').match(filter);
}
export async function updateWorkshop(id: string, updates: any) {
  return supabase.from('workshops').update(updates).eq('id', id).select();
}
export async function deleteWorkshop(id: string) {
  return supabase.from('workshops').delete().eq('id', id);
}
