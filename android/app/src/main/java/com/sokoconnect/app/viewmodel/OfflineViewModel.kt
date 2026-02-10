package com.sokoconnect.app.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sokoconnect.app.data.model.OfflineData
import com.sokoconnect.app.data.repository.OfflineRepository
import com.sokoconnect.app.data.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class OfflineUiState(
    val offlineData: OfflineData? = null,
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null
)

class OfflineViewModel(context: Context) : ViewModel() {
    private val repository = OfflineRepository(context)
    private val _uiState = MutableStateFlow(OfflineUiState())
    val uiState: StateFlow<OfflineUiState> = _uiState.asStateFlow()

    fun saveData(data: OfflineData) {
        viewModelScope.launch {
            repository.saveData(data).collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
                    is Result.Success -> _uiState.update { it.copy(isLoading = false, successMessage = "Data saved for offline use!") }
                    is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                }
            }
        }
    }
    fun loadData() {
        viewModelScope.launch {
            repository.loadData().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(isLoading = false) }
                    is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                }
            }
        }
    }
    fun clearCache() {
        viewModelScope.launch {
            repository.clearCache().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
                    is Result.Success -> _uiState.update { it.copy(isLoading = false, successMessage = "Offline cache cleared!") }
                    is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                }
            }
        }
    }
    // Add sync logic as needed
} 

