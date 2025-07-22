package com.agriconnect.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject
import com.agriconnect.app.data.SupabaseClientProvider

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    @Inject
    lateinit var supabaseProvider: SupabaseClientProvider

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    TodoList(supabaseProvider)
                }
            }
        }
    }
}

@Composable
fun TodoList(supabaseProvider: SupabaseClientProvider) {
    var items by remember { mutableStateOf<List<TodoItem>>(listOf()) }

    LaunchedEffect(Unit) {
        withContext(Dispatchers.IO) {
            items = supabaseProvider.client
                .from("todos")
                .select()
                .decodeList<TodoItem>()
        }
    }

    LazyColumn {
        items(
            items,
            key = { item -> item.id }
        ) { item ->
            Text(
                item.name,
                modifier = Modifier.padding(8.dp)
            )
        }
    }
}

@Serializable
data class TodoItem(val id: Int, val name: String)
