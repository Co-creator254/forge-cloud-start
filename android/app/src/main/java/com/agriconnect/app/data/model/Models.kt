package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class News(
    val id: String,
    val title: String,
    val content: String,
    val imageUrl: String? = null,
    val createdAt: String
)

@Serializable
data class Service(
    val id: String,
    val name: String,
    val description: String,
    val imageUrl: String? = null,
    val status: String
)

@Serializable
data class Product(
    val id: String,
    val name: String,
    val description: String,
    val price: Double,
    val imageUrl: String? = null,
    val category: String
)
