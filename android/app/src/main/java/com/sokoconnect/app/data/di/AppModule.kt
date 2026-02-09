package com.sokoconnect.app.data.di

import com.sokoconnect.app.BuildConfig
import com.sokoconnect.app.data.Repository
import com.sokoconnect.app.data.SupabaseClient
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClient {
        return SupabaseClient()
    }

    @Provides
    @Singleton
    fun provideRepository(supabaseClient: SupabaseClient): Repository {
        return Repository(supabaseClient)
    }
}

