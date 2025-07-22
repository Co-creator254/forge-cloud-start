package com.agriconnect.app.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class Repository @Inject constructor(
    private val supabaseClient: SupabaseClient
) {
    suspend fun getNews(): Flow<Result<List<News>>> = flow {
        emit(Result.Loading)
        try {
            val news = supabaseClient.client.postgrest["news"].select().decodeList<News>()
            emit(Result.Success(news))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun getServices(): Flow<Result<List<Service>>> = flow {
        emit(Result.Loading)
        try {
            val services = supabaseClient.client.postgrest["services"].select().decodeList<Service>()
            emit(Result.Success(services))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun getProducts(): Flow<Result<List<Product>>> = flow {
        emit(Result.Loading)
        try {
            val products = supabaseClient.client.postgrest["products"].select().decodeList<Product>()
            emit(Result.Success(products))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
}
