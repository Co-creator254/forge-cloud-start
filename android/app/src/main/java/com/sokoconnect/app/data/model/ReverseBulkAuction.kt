package com.sokoconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class ReverseBulkAuction(
    val id: String = "",
    val auctionName: String = "",
    val items: List<ReverseBulkAuctionItem> = emptyList(),
    val status: String = "open",
    val createdAt: String = "",
    val updatedAt: String = ""
)

@Serializable
data class ReverseBulkAuctionItem(
    val id: String = "",
    val productName: String = "",
    val quantity: Int = 0,
    val unit: String = "",
    val bidPrice: Double = 0.0
) 
