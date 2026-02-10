package com.sokoconnect.app.data.repository

import com.sokoconnect.app.data.Result
import com.sokoconnect.app.data.model.Warehouse
import com.sokoconnect.app.data.model.WarehouseBooking
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class WarehouseRepository {
    fun fetchWarehouses(): Flow<Result<List<Warehouse>>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun fetchWarehouseBookings(userId: String): Flow<Result<List<WarehouseBooking>>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun createWarehouseBooking(booking: WarehouseBooking): Result<WarehouseBooking> {
        return try {
            Result.Success(booking)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }
}

    }
}

