package com.sokoconnect.app.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton
import com.sokoconnect.app.data.model.*

@Singleton
class Repository @Inject constructor() {
    suspend fun getServices(): Flow<List<Service>> = flow {
        emit(emptyList())
    }

    suspend fun getProducts(): Flow<List<Product>> = flow {
        emit(emptyList())
    }

    suspend fun getNews(): Flow<List<News>> = flow {
        emit(emptyList())
    }

    suspend fun uploadImage(imageBytes: ByteArray, path: String): String {
        return "uploaded"
    }
}

