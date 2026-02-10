package com.sokoconnect.app.data.repository

import com.sokoconnect.app.data.model.Donation
import com.sokoconnect.app.data.model.DonationRequest
import com.sokoconnect.app.supabase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

import com.sokoconnect.app.data.Result

class DonationRepository {
    fun fetch(): kotlinx.coroutines.flow.Flow<Result<List<Any>>> = kotlinx.coroutines.flow.flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun fetchDonations(): Flow<Result<List<Donation>>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun fetchDonationRequests(): Flow<Result<List<DonationRequest>>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(emptyList()))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun createDonation(donation: Donation): Flow<Result<Donation>> = flow {
        emit(Result.Loading)
        try {
            emit(Result.Success(donation))
        } catch (e: Exception) {
            emit(Result.Error(e))
    }
}

