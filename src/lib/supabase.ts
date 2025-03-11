import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// Test the connection and log the result
if (typeof window !== 'undefined') {
  supabase.from('movies').select('count').then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error)
    } else {
      console.log('Supabase connection test successful')
    }
  })
} 
