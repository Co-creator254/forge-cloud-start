package com.sokoconnect.app.data.repository

import com.sokoconnect.app.data.model.Auction
import com.sokoconnect.app.data.model.AuctionBid
import com.sokoconnect.app.supabase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

import com.sokoconnect.app.data.Result

class AuctionRepository {
    fun fetch(): kotlinx.coroutines.flow.Flow<Result<List<Any>>> = kotlinx.coroutines.flow.flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun fetchAuctions(): Flow<Result<List<Auction>>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun fetchBids(auctionId: String): Flow<Result<List<AuctionBid>>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun createAuction(auction: Auction): Flow<Result<Auction>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(auction))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
}

