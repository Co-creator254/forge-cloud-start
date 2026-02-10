package com.sokoconnect.app.data.repository

import com.sokoconnect.app.data.Result
import com.sokoconnect.app.data.model.ServiceProvider
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class ServiceProviderRepository {
    fun fetchServiceProviders(): Flow<Result<List<ServiceProvider>>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun createServiceProvider(provider: ServiceProvider): Result<ServiceProvider> {
        return try {
            Result.Success(provider)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    fun updateServiceProvider(provider: ServiceProvider): Result<ServiceProvider> {
        return try {
            Result.Success(provider)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    fun deleteServiceProvider(id: String): Result<Unit> {
        return try {
            Result.Success(Unit)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }
}

}

