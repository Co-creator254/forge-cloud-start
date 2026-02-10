package com.sokoconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class PriceTrend(
    val id: String = "",
    val product: String = "",
    val date: String = "",
    val price: Double = 0.0,
    val source: String = ""
) 
