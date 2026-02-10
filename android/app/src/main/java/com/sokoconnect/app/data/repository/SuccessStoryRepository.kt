package com.sokoconnect.app.data.repository

import com.sokoconnect.app.data.Result
import com.sokoconnect.app.data.model.SuccessStory
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class SuccessStoryRepository {
    fun fetchStories(): Flow<Result<List<SuccessStory>>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun createStory(story: SuccessStory): Result<SuccessStory> {
        return try {
            Result.Success(story)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }
}

}

