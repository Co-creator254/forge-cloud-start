package com.sokoconnect.app.data

import javax.inject.Inject
import javax.inject.Singleton
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.storage.Storage
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.realtime.Realtime

@Singleton
class SupabaseProvider @Inject constructor() {
    val client: SupabaseClient = createSupabaseClient(
        supabaseUrl = "https://xgtmpfginlxrntixpqim.supabase.co",
        supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndG1wZmdpbmx4cm50aXhwcWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzYzNDMsImV4cCI6MjA3MDA1MjM0M30.UityH607C-tazH7bvhS5G5CJaO2u7OhjIkoFQ6kPF10"
    ) {
        install(Postgrest)
        install(Storage)
        install(Auth)
        install(Realtime)
    }
}

