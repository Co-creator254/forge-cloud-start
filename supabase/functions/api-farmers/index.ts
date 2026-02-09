
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { authenticateRequest, checkRateLimit, logApiUsage, createApiResponse, createErrorResponse } from '../_shared/middleware.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req: Request): Promise<Response> => {
  const startTime = Date.now()
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const auth = await authenticateRequest(req)
    if (!auth.valid) {
      await logApiUsage('', '', '/api/v1/farmers', req.method, 401, Date.now() - startTime, req)
      return createErrorResponse(auth.error || 'Unauthorized', 401)
    }

    const rateLimit = await checkRateLimit(auth.user_id!, auth.subscription_type!)
    if (!rateLimit.allowed) {
      await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/farmers', req.method, 429, Date.now() - startTime, req)
      return createErrorResponse('Rate limit exceeded', 429)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const county = url.searchParams.get('county')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Always select the full set of columns
    let query = supabase.from('profiles').select(`
      id,
      full_name,
      county,
      contact_number,
      email,
      role,
      created_at
    `).eq('role', 'farmer')

    // Apply subscription-based limits only
    if (auth.subscription_type === 'free') {
      query = query.limit(10)
    } else if (auth.subscription_type === 'developer') {
      query = query.limit(100)
    }

    if (county) {
      query = query.ilike('county', `%${county}%`)
    }

    query = query.range(offset, offset + limit - 1)

    const { data: farmers, error } = await query

    if (error) {
      console.error('Database error:', error)
      await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/farmers', req.method, 500, Date.now() - startTime, req)
      return createErrorResponse('Internal server error', 500)
    }

    // Transform data based on subscription
    const transformedData = farmers?.map((farmer: any) => {
      const baseData = {
        id: farmer.id,
        name: farmer.full_name,
        county: farmer.county,
        joinDate: farmer.created_at
      }

      if (auth.subscription_type === 'free') {
        return {
          ...baseData,
          contact: 'Upgrade to Developer tier for contact info'
        }
      }

      if (auth.subscription_type === 'developer') {
        return {
          ...baseData,
          email: farmer.email,
          contact: 'Upgrade to Enterprise for full contact details'
        }
      }

      return {
        ...baseData,
        email: farmer.email,
        phone: farmer.contact_number,
        role: farmer.role
      }
    })

    const responseTime = Date.now() - startTime
    await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/farmers', req.method, 200, responseTime, req)

    return createApiResponse({
      data: transformedData,
      meta: {
        count: farmers?.length || 0,
        limit,
        offset,
        subscription_type: auth.subscription_type,
        rate_limit: {
          remaining: rateLimit.remaining,
          limit: rateLimit.limit,
          reset_time: rateLimit.reset_time
        }
      }
    })

  } catch (error: unknown) {
    console.error('API error:', error)
    return createErrorResponse('Internal server error', 500)
  }
})