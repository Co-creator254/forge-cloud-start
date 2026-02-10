package com.sokoconnect.app.data.repository

import com.sokoconnect.app.data.model.LogisticsProvider
import com.sokoconnect.app.data.model.Aggregator
import com.sokoconnect.app.data.model.Processor
import com.sokoconnect.app.supabase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

import com.sokoconnect.app.data.Result

class LogisticsRepository {
    fun fetch(): kotlinx.coroutines.flow.Flow<Result<List<Any>>> = kotlinx.coroutines.flow.flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
}

