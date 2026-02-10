package com.sokoconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class OfflineData(
    val id: String = "",
    val type: String = "",
    val content: String = "",
    val synced: Boolean = false,
    val createdAt: String = ""
)

@Serializable
data class Review(
    val id: String = "",
    val userId: String = "",
    val rating: Int = 0,
    val comment: String = "",
    val createdAt: String = ""
)

@Serializable
data class ServiceProvider(
    val id: String = "",
    val name: String = "",
    val serviceType: String = "",
    val location: String = "",
    val contact: String = "",
    val rating: Double = 0.0,
    val imageUrl: String? = null
)

@Serializable
data class AppSettings(
    val id: String = "",
    val theme: String = "light",
    val notificationsEnabled: Boolean = true,
    val language: String = "en"
)

@Serializable
data class SuccessStory(
    val id: String = "",
    val title: String = "",
    val content: String = "",
    val farmerName: String = "",
    val imageUrl: String? = null,
    val date: String = ""
)

@Serializable
data class Warehouse(
    val id: String = "",
    val name: String = "",
    val location: String = "",
    val capacity: Double = 0.0,
    val availableSpace: Double = 0.0,
    val pricePerUnit: Double = 0.0,
    val imageUrl: String? = null
)

@Serializable
data class WarehouseBooking(
    val id: String = "",
    val warehouseId: String = "",
    val userId: String = "",
    val quantity: Double = 0.0,
    val startDate: String = "",
    val endDate: String = "",
    val status: String = "pending"
)

@Serializable
data class Notification(
    val id: String = "",
    val title: String = "",
    val message: String = "",
    val type: String = "",
    val isRead: Boolean = false,
    val createdAt: String = ""
)

@Serializable
data class NotificationPreference(
    val id: String = "",
    val userId: String = "",
    val type: String = "",
    val enabled: Boolean = true
)

@Serializable
data class FoodRescueListing(
    val id: String = "",
    val description: String = "",
    val quantity: Double = 0.0,
    val status: String = "available",
    val location: String = ""
)

@Serializable
data class LogisticsProvider(
    val id: String = "",
    val name: String = "",
    val type: String = ""
)

@Serializable
data class Aggregator(
    val id: String = "",
    val name: String = "",
    val location: String = ""
)

@Serializable
data class Processor(
    val id: String = "",
    val name: String = "",
    val capacity: Double = 0.0
)

@Serializable
data class LandParcel(
    val id: String = "",
    val name: String = "",
    val size: Double = 0.0,
    val location: String = ""
)

@Serializable
data class Crop(
    val id: String = "",
    val name: String = "",
    val variety: String = "",
    val plantingDate: String = ""
)

@Serializable
data class Animal(
    val id: String = "",
    val tagId: String = "",
    val species: String = "",
    val breed: String = "",
    val age: Int = 0
)

@Serializable
data class InventoryItem(
    val id: String = "",
    val name: String = "",
    val quantity: Double = 0.0,
    val unit: String = ""
)

@Serializable
data class FinanceRecord(
    val id: String = "",
    val type: String = "",
    val amount: Double = 0.0,
    val description: String = "",
    val date: String = ""
)

@Serializable
data class BuyRequest(
    val id: String = "",
    val cropId: String = "",
    val quantity: Double = 0.0,
    val status: String = "pending"
)

@Serializable
data class FoodRescueMatch(
    val id: String = "",
    val listingId: String = "",
    val recipientId: String = "",
    val status: String = "matched"
)

@Serializable
data class CommunityPost(
    val id: String = "",
    val title: String = "",
    val content: String = "",
    val authorName: String = "",
    val date: String = ""
)

@Serializable
data class DonationRequest(
    val id: String = "",
    val userId: String = "",
    val item: String = "",
    val quantity: Double = 0.0,
    val status: String = "pending"
)
@Serializable
data class Auction(
    val id: String = "",
    val itemName: String = "",
    val startingBid: Double = 0.0,
    val currentBid: Double = 0.0,
    val endDate: String = "",
    val status: String = "active"
)

@Serializable
data class AuctionBid(
    val id: String = "",
    val auctionId: String = "",
    val userId: String = "",
    val bidAmount: Double = 0.0,
    val timestamp: String = ""
)

@Serializable
data class UserProfile(
    val id: String = "",
    val fullName: String = "",
    val email: String = "",
    val role: String = "user",
    val imageUrl: String? = null,
    val bio: String? = null,
    val createdAt: String = ""
)

@Serializable
data class AdminUser(
    val id: String = "",
    val username: String = "",
    val role: String = "",
    val lastLogin: String = ""
)

@Serializable
data class AdminLog(
    val id: String = "",
    val action: String = "",
    val userId: String = "",
    val timestamp: String = "",
    val details: String = ""
)

@Serializable
data class SystemStatus(
    val id: String = "",
    val status: String = "online",
    val lastChecked: String = "",
    val uptime: Double = 0.0,
    val message: String = ""
)

@Serializable
data class AnalyticsRecord(
    val id: String = "",
    val event: String = "",
    val userId: String = "",
    val timestamp: String = "",
    val data: String = ""
)