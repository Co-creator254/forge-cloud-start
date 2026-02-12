import { supabase } from '@/integrations/supabase/client';

// Types for the new schema
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_info?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  product_id: string;
  supplier_id?: string;
  lot_number?: string;
  quantity: number;
  received_at?: string;
  location_id?: string;
  created_by?: string;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  product?: Product;
  supplier?: Supplier;
  location?: Location;
}

export interface QualityCheck {
  id: string;
  batch_id: string;
  inspector_id?: string;
  created_by?: string;
  status: 'pending' | 'passed' | 'failed' | 'reworked';
  notes?: string;
  measured_values?: Record<string, any>;
  performed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplyChainQualityControl {
  id: string;
  product_id?: string;
  batch_id?: string;
  location_id?: string;
  check_id?: string;
  status: 'open' | 'investigating' | 'closed';
  severity: 'low' | 'medium' | 'high';
  reported_by?: string;
  assigned_to?: string;
  details?: Record<string, any>;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  auth_user_id: string;
  full_name?: string;
  email?: string;
  role: string;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BatchQCSummary {
  batch_id: string;
  lot_number?: string;
  product_id: string;
  product_name: string;
  passed_checks: number;
  failed_checks: number;
  last_check_at?: string;
}

export const supplyChainService = {
  // Products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Product[];
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  // Suppliers
  async getSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Supplier[];
  },

  async createSupplier(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplier)
      .select()
      .single();

    if (error) throw error;
    return data as Supplier;
  },

  // Locations
  async getLocations() {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Location[];
  },

  async createLocation(location: Omit<Location, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('locations')
      .insert(location)
      .select()
      .single();

    if (error) throw error;
    return data as Location;
  },

  // Batches
  async getBatches() {
    const { data, error } = await supabase
      .from('batches')
      .select(`
        *,
        product:products(*),
        supplier:suppliers(*),
        location:locations(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Batch[];
  },

  async createBatch(batch: Omit<Batch, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('batches')
      .insert(batch)
      .select(`
        *,
        product:products(*),
        supplier:suppliers(*),
        location:locations(*)
      `)
      .single();

    if (error) throw error;
    return data as Batch;
  },

  async updateBatch(id: string, updates: Partial<Batch>) {
    const { data, error } = await supabase
      .from('batches')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        product:products(*),
        supplier:suppliers(*),
        location:locations(*)
      `)
      .single();

    if (error) throw error;
    return data as Batch;
  },

  // Quality Checks
  async getQualityChecks(batchId?: string) {
    let query = supabase
      .from('quality_checks')
      .select('*')
      .order('created_at', { ascending: false });

    if (batchId) {
      query = query.eq('batch_id', batchId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as QualityCheck[];
  },

  async createQualityCheck(check: Omit<QualityCheck, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('quality_checks')
      .insert(check)
      .select()
      .single();

    if (error) throw error;
    return data as QualityCheck;
  },

  async updateQualityCheck(id: string, updates: Partial<QualityCheck>) {
    const { data, error } = await supabase
      .from('quality_checks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as QualityCheck;
  },

  // Quality Control Issues
  async getQualityControlIssues() {
    const { data, error } = await supabase
      .from('supply_chain_quality_control')
      .select(`
        *,
        product:products(*),
        batch:batches(*),
        location:locations(*),
        check:quality_checks(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as SupplyChainQualityControl[];
  },

  async createQualityControlIssue(issue: Omit<SupplyChainQualityControl, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('supply_chain_quality_control')
      .insert(issue)
      .select(`
        *,
        product:products(*),
        batch:batches(*),
        location:locations(*),
        check:quality_checks(*)
      `)
      .single();

    if (error) throw error;
    return data as SupplyChainQualityControl;
  },

  async updateQualityControlIssue(id: string, updates: Partial<SupplyChainQualityControl>) {
    const { data, error } = await supabase
      .from('supply_chain_quality_control')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        product:products(*),
        batch:batches(*),
        location:locations(*),
        check:quality_checks(*)
      `)
      .single();

    if (error) throw error;
    return data as SupplyChainQualityControl;
  },

  // Dashboard Summary
  async getDashboardSummary() {
    const { data: batches, error: batchesError } = await supabase
      .from('batches')
      .select('quantity, created_at');

    const { data: qualityChecks, error: qcError } = await supabase
      .from('quality_checks')
      .select('status, performed_at');

    const { data: issues, error: issuesError } = await supabase
      .from('supply_chain_quality_control')
      .select('status, severity');

    if (batchesError) throw batchesError;
    if (qcError) throw qcError;
    if (issuesError) throw issuesError;

    return {
      totalBatches: batches?.length || 0,
      totalQuantity: batches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0,
      passedChecks: qualityChecks?.filter(qc => qc.status === 'passed').length || 0,
      failedChecks: qualityChecks?.filter(qc => qc.status === 'failed').length || 0,
      pendingChecks: qualityChecks?.filter(qc => qc.status === 'pending').length || 0,
      openIssues: issues?.filter(issue => issue.status === 'open').length || 0,
      highSeverityIssues: issues?.filter(issue => issue.severity === 'high').length || 0,
    };
  },

  // Batch QC Summary View
  async getBatchQCSummary() {
    const { data, error } = await supabase
      .from('v_batch_qc_summary')
      .select('*')
      .order('last_check_at', { ascending: false, nullsFirst: false });

    if (error) throw error;
    return data as BatchQCSummary[];
  },

  // User Profile
  async getUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as UserProfile | null;
  },

  async createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  },
};
