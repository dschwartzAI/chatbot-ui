import { workspacesTable } from "@/db/schema"
import { createClient } from "@supabase/supabase-js"
import { drizzle } from "drizzle-orm/node-postgres"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

const client = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
})

// Schema object for future tables
const schema = { workspaces: workspacesTable }

// Initialize Drizzle with the schema
export const db = drizzle(client, { schema })
