package com.sokoconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class BarterTrade(
    val id: String = "",
    val offeredItem: String = "",
    val requestedItem: String = "",
    val status: String = "open",
    val createdAt: String = "",
    val updatedAt: String = ""
) 
