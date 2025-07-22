        }
        composable("services") {
            ServicesScreen(navController = navController)
        }
        composable("products") {
            ProductsScreen(navController = navController)
        }
    }
}
package com.agriconnect.app.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable

@Composable
fun AppNavigation(navController: NavHostController) {
    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(navController = navController)
        }
        composable("news") {
            NewsScreen(navController = navController)
