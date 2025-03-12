import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

// Create a singleton instance of the Supabase client
export const supabase = createClientComponentClient<Database>()

// Connection status tracking
let connectionStatus = {
  isConnected: false,
  lastChecked: 0,
  error: null as Error | null
}

// Test the connection and log the result
const testConnection = async () => {
  // Only test connection once every 5 minutes
  const now = Date.now()
  if (now - connectionStatus.lastChecked < 5 * 60 * 1000 && connectionStatus.isConnected) {
    return connectionStatus
  }

  connectionStatus.lastChecked = now

  try {
    const { data, error } = await supabase.from('movies').select('count')
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      connectionStatus.isConnected = false
      connectionStatus.error = error
    } else {
      console.log('Supabase connection test successful')
      connectionStatus.isConnected = true
      connectionStatus.error = null
    }
  } catch (err) {
    console.error('Supabase connection test error:', err)
    connectionStatus.isConnected = false
    connectionStatus.error = err instanceof Error ? err : new Error('Unknown error')
  }

  return connectionStatus
}

// Run connection test in browser environment
if (typeof window !== 'undefined') {
  testConnection()
}

export { testConnection }
