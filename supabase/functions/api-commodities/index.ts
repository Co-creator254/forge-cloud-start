
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { authenticateRequest, checkRateLimit, logApiUsage, createApiResponse, createErrorResponse } from '../api-middleware/index.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
}

serve(async (req: Request): Promise<Response> => {
  const startTime = Date.now()
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const auth = await authenticateRequest(req)
    if (!auth.valid) {
      return createErrorResponse(auth.error || 'Unauthorized', 401)
    }

    const rateLimit = await checkRateLimit(auth.user_id!, auth.subscription_type!)
    if (!rateLimit.allowed) {
      return createErrorResponse('Rate limit exceeded', 429)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const commodity = url.searchParams.get('commodity')
    const county = url.searchParams.get('county')
    const days = parseInt(url.searchParams.get('days') || '30')

    let query = supabase.from('market_prices').select(`
      commodity_name,
      county,
      market_name,
      price,
      unit,
      date_recorded,
      confidence_score,
      verified
    `).gte('date_recorded', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order('date_recorded', { ascending: false })

    if (commodity) {
      query = query.ilike('commodity_name', `%${commodity}%`)
    }
    if (county) {
      query = query.ilike('county', `%${county}%`)
    }

    // Apply subscription-based limits
    if (auth.subscription_type === 'free') {
      query = query.limit(20)
    } else if (auth.subscription_type === 'developer') {
      query = query.limit(100)
    } else {
      query = query.limit(500)
    }

    const { data: prices, error } = await query

    if (error) {
      console.error('Database error:', error)
      return createErrorResponse('Internal server error', 500)
    }

    // Process data by commodity
    const commodityData = prices?.reduce((acc: any, price: any) => {
      if (!acc[price.commodity_name]) {
        acc[price.commodity_name] = {
          name: price.commodity_name,
          markets: [],
          price_history: [],
          average_price: 0,
          min_price: Infinity,
          max_price: 0,
          unit: price.unit
        }
      }

      const commodity = acc[price.commodity_name]
      commodity.price_history.push({
        price: price.price,
        date: price.date_recorded,
        market: price.market_name,
        county: price.county,
        verified: price.verified
      })

      if (price.price < commodity.min_price) commodity.min_price = price.price
      if (price.price > commodity.max_price) commodity.max_price = price.price

      const marketKey = `${price.market_name}-${price.county}`
      if (!commodity.markets.find((m: any) => m.key === marketKey)) {
        commodity.markets.push({
          key: marketKey,
          name: price.market_name,
          county: price.county,
          latest_price: price.price,
          last_updated: price.date_recorded
        })
      }

      return acc
    }, {})

    // Calculate averages
    Object.values(commodityData || {}).forEach((commodity: any) => {
      const totalPrice = commodity.price_history.reduce((sum: number, p: any) => sum + p.price, 0)
      commodity.average_price = totalPrice / commodity.price_history.length
      commodity.price_trend = commodity.price_history.length > 1 ? 
        (commodity.price_history[0].price > commodity.price_history[commodity.price_history.length - 1].price ? 'increasing' : 'decreasing') : 'stable'
    })

    const responseTime = Date.now() - startTime
    await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/commodities', req.method, 200, responseTime, req)

    return createApiResponse({
      data: Object.values(commodityData || {}),
      meta: {
        period_days: days,
        commodities_found: Object.keys(commodityData || {}).length,
        total_price_points: prices?.length || 0,
        subscription_type: auth.subscription_type,
        rate_limit: {
          remaining: rateLimit.remaining,
          limit: rateLimit.limit
        }
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return createErrorResponse('Internal server error', 500)
  }
})
