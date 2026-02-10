package com.sokoconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class MarketplaceListing(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val price: Double = 0.0,
    val seller: String = "",
    val createdAt: String = "",
    val updatedAt: String = ""
) 
