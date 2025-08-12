import { supabase } from '@/integrations/supabase/client';

// --- SUPPLIERS ---
export const createSupplier = async (data: any) => {
  return (supabase as any).from('farm_input_suppliers').insert([data]);
};
export const updateSupplier = async (id: string, data: any) => {
  return (supabase as any).from('farm_input_suppliers').update(data).eq('id', id);
};
export const getSuppliers = async () => {
  return (supabase as any).from('farm_input_suppliers').select('*');
};

// --- PRODUCTS ---
export const createProduct = async (data: any) => {
  return (supabase as any).from('farm_input_products').insert([data]);
};
export const updateProduct = async (id: string, data: any) => {
  return (supabase as any).from('farm_input_products').update(data).eq('id', id);
};
export const getProducts = async (filters?: any) => {
  let query = (supabase as any).from('farm_input_products').select('*');
  if (filters?.product_category) query = query.eq('product_category', filters.product_category);
  if (filters?.search) query = query.ilike('product_name', `%${filters.search}%`);
  return query;
};

// --- ORDERS ---
export const createOrder = async (data: any) => {
  const { order_status, ...rest } = data;
  return (supabase as any).from('farm_input_orders').insert([
    {
      status: order_status || 'pending',
      ...rest,
    },
  ]);
};
export const getOrders = async (filters?: any) => {
  let query = (supabase as any).from('farm_input_orders').select('*');
  if (filters?.buyer_id) query = query.eq('buyer_id', filters.buyer_id);
  if (filters?.supplier_id) query = query.eq('supplier_id', filters.supplier_id);
  return query;
};
export const updateOrder = async (id: string, data: any) => {
  return (supabase as any).from('farm_input_orders').update(data).eq('id', id);
};

// --- ORDER ITEMS ---
export const createOrderItem = async (data: any) => {
  return (supabase as any).from('farm_input_order_items').insert([data]);
};
export const updateOrderItem = async (id: string, data: any) => {
  return (supabase as any).from('farm_input_order_items').update(data).eq('id', id);
};

// --- DELETE FUNCTIONS ---
export const deleteSupplier = async (id: string) => {
  return (supabase as any).from('farm_input_suppliers').delete().eq('id', id);
};
export const deleteProduct = async (id: string) => {
  return (supabase as any).from('farm_input_products').delete().eq('id', id);
};
export const deleteOrder = async (id: string) => {
  return (supabase as any).from('farm_input_orders').delete().eq('id', id);
};

