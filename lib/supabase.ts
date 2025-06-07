import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          price: number
          description: string
          long_description: string
          category: string
          tech_stack: string[]
          tags: string[]
          features: string[]
          demo_url: string | null
          github_url: string | null
          license: string
          difficulty: string
          images: string[]
          rating: number
          downloads: number
          created_at: string
          updated_at: string
          version: string
          featured: boolean
        }
        Insert: {
          id?: string
          title: string
          price: number
          description: string
          long_description: string
          category: string
          tech_stack: string[]
          tags: string[]
          features: string[]
          demo_url?: string | null
          github_url?: string | null
          license: string
          difficulty: string
          images: string[]
          rating?: number
          downloads?: number
          created_at?: string
          updated_at?: string
          version: string
          featured?: boolean
        }
        Update: {
          id?: string
          title?: string
          price?: number
          description?: string
          long_description?: string
          category?: string
          tech_stack?: string[]
          tags?: string[]
          features?: string[]
          demo_url?: string | null
          github_url?: string | null
          license?: string
          difficulty?: string
          images?: string[]
          rating?: number
          downloads?: number
          created_at?: string
          updated_at?: string
          version?: string
          featured?: boolean
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          project_type: string
          tech_stack: string | null
          project_details: string
          budget: string | null
          deadline: string | null
          status: string
          priority: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          project_type: string
          tech_stack?: string | null
          project_details: string
          budget?: string | null
          deadline?: string | null
          status?: string
          priority?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          project_type?: string
          tech_stack?: string | null
          project_details?: string
          budget?: string | null
          deadline?: string | null
          status?: string
          priority?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          project_id: string
          amount: number
          currency: string
          payment_status: string
          payment_method: string | null
          transaction_id: string | null
          download_count: number
          max_downloads: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          amount: number
          currency?: string
          payment_status?: string
          payment_method?: string | null
          transaction_id?: string | null
          download_count?: number
          max_downloads?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          amount?: number
          currency?: string
          payment_status?: string
          payment_method?: string | null
          transaction_id?: string | null
          download_count?: number
          max_downloads?: number
          created_at?: string
          updated_at?: string
        }
      }
      project_files: {
        Row: {
          id: string
          project_id: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          is_main_file: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          is_main_file?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          is_main_file?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          project_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          project_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          created_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string
          project_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          created_at?: string
        }
      }
    }
  }
}

// Helper functions for common operations
export const uploadFile = async (file: File, path: string) => {
  const { data, error } = await supabase.storage.from("project-files").upload(path, file)

  if (error) throw error
  return data
}

export const getFileUrl = (path: string) => {
  const { data } = supabase.storage.from("project-files").getPublicUrl(path)

  return data.publicUrl
}

export const deleteFile = async (path: string) => {
  const { error } = await supabase.storage.from("project-files").remove([path])

  if (error) throw error
}

// Database connection check
export const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("projects").select("count").limit(1)
    return { connected: !error, error }
  } catch (error) {
    return { connected: false, error }
  }
}
