package com.sokoconnect.app.data.repository

import com.sokoconnect.app.data.model.PriceTrend
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.sokoconnect.app.supabase

class PriceTrendsRepository {
    suspend fun fetchPriceTrends(): List<PriceTrend> = withContext(Dispatchers.IO) {
        supabase.from("price_trends").select().decodeList<PriceTrend>()
    }
} 
