package com.sokoconnect.app.data.repository

import com.sokoconnect.app.data.Result
import com.sokoconnect.app.data.model.AppSettings
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class SettingsRepository {
    fun fetchSettings(userId: String): Flow<Result<AppSettings>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(AppSettings()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun updateSettings(userId: String, updates: Map<String, Any>): Result<AppSettings> {
        return try {
            Result.Success(AppSettings())
        } catch (e: Exception) {
            Result.Error(e)
        }
    }
}

}

