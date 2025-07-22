package com.agriconnect.app.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavController) {
    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                NavigationBarItem(
                    selected = currentRoute == "home",
                    onClick = { navController.navigate("home") },
                    icon = { Icon(Icons.Default.Home, "Home") },
                    label = { Text("Home") }
                )
                NavigationBarItem(
                    selected = currentRoute == "news",
                    onClick = { navController.navigate("news") },
                    icon = { Icon(Icons.Default.Article, "News") },
                    label = { Text("News") }
                )
                NavigationBarItem(
                    selected = currentRoute == "services",
                    onClick = { navController.navigate("services") },
                    icon = { Icon(Icons.Default.Build, "Services") },
                    label = { Text("Services") }
                )
                NavigationBarItem(
                    selected = currentRoute == "products",
                    onClick = { navController.navigate("products") },
                    icon = { Icon(Icons.Default.ShoppingCart, "Products") },
                    label = { Text("Products") }
                )
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Home screen content
            FeaturedNewsSection()
            PopularServicesSection()
            TrendingProductsSection()
        }
    }
}
