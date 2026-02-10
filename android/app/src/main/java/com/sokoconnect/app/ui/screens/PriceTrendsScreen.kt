package com.sokoconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.sokoconnect.app.ui.viewmodels.PriceTrendsViewModel
import com.sokoconnect.app.data.model.PriceTrend
import androidx.compose.runtime.collectAsState
import androidx.compose.material3.CircularProgressIndicator

@Composable
fun PriceTrendsScreen() {
    val viewModel: PriceTrendsViewModel = viewModel()
    val trends = viewModel.trends.collectAsState()
    val loading = viewModel.loading.collectAsState()
    val error = viewModel.error.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Price Trends") })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (loading.value) {
                CircularProgressIndicator()
            } else if (error.value != null) {
                Text("Error: ${error.value}", color = MaterialTheme.colorScheme.error)
            } else {
                Text("Price Trends:", style = MaterialTheme.typography.headlineSmall)
                trends.value.forEach { trend ->
                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Column(Modifier.padding(8.dp)) {
                            Text("Product: ${trend.product}")
                            Text("Date: ${trend.date}")
                            Text("Price: ${trend.price}")
                            Text("Source: ${trend.source}")
                        }
                    }
                }
            }
        }
    }
} 
