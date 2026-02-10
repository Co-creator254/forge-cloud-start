package com.sokoconnect.app.data.repository

import com.sokoconnect.app.data.Result
import com.sokoconnect.app.data.model.Review
import com.sokoconnect.app.supabase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class ReviewRepository {
    suspend fun fetchReviews(): Flow<Result<List<Review>>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun createReview(review: Review): Flow<Result<Review>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(review))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
}
