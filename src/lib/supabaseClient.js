import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mbfkfggvlxbquyedbtxw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZmtmZ2d2bHhicXV5ZWRidHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTQzNDUsImV4cCI6MjA5MjAzMDM0NX0.kMY2m6Ie66s91o5zGcLOlZnHrzPiP7I30wrP9FTeuhU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)