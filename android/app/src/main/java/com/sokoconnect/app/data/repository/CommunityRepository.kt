package com.sokoconnect.app.data.repository

import com.sokoconnect.app.data.model.CommunityPost
import com.sokoconnect.app.supabase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

import com.sokoconnect.app.data.Result

class CommunityRepository {
    fun fetch(): kotlinx.coroutines.flow.Flow<Result<List<Any>>> = kotlinx.coroutines.flow.flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun fetchPosts(): Flow<Result<List<CommunityPost>>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun createPost(post: CommunityPost): Flow<Result<CommunityPost>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(post))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
}

