-- Add license_key and user_details columns to purchases table
ALTER TABLE public.purchases 
ADD COLUMN IF NOT EXISTS license_key TEXT,
ADD COLUMN IF NOT EXISTS user_details JSONB;

-- Create function to increment downloads
CREATE OR REPLACE FUNCTION public.increment_downloads(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.projects 
    SET downloads = downloads + 1,
        updated_at = NOW()
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.increment_downloads(UUID) TO authenticated;

-- Update purchases table policies
CREATE POLICY IF NOT EXISTS "Users can view their own purchases" ON public.purchases
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own purchases" ON public.purchases
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create downloads tracking table
CREATE TABLE IF NOT EXISTS public.download_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    download_url TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Enable RLS on download_logs
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for download_logs
CREATE POLICY "Users can view their own download logs" ON public.download_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own download logs" ON public.download_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.download_logs TO authenticated;
