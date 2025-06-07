-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  demo_url VARCHAR(500),
  github_url VARCHAR(500),
  license VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0.0,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version VARCHAR(20) DEFAULT '1.0.0',
  featured BOOLEAN DEFAULT FALSE
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  project_type VARCHAR(100) NOT NULL,
  tech_stack VARCHAR(500),
  project_details TEXT NOT NULL,
  budget VARCHAR(100),
  deadline VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for projects (allow read for everyone, write for authenticated users)
CREATE POLICY "Allow public read access on projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on projects" ON public.projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on projects" ON public.projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on projects" ON public.projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for contact_submissions (only authenticated users can access)
CREATE POLICY "Allow authenticated access on contact_submissions" ON public.contact_submissions
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample projects with Indian pricing
INSERT INTO public.projects (
  title, price, description, long_description, category, tech_stack, tags, features,
  demo_url, github_url, license, difficulty, images, rating, downloads, version, featured
) VALUES 
(
  'E-commerce Dashboard',
  24999.00,
  'Complete admin dashboard with analytics, inventory management, and order tracking',
  'This comprehensive e-commerce dashboard provides everything you need to manage your online store effectively. Features include real-time analytics, inventory management, order tracking, customer management, and detailed reporting. Built with React, Next.js, and Tailwind CSS for optimal performance and user experience.',
  'Web Application',
  ARRAY['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
  ARRAY['React', 'Next.js', 'Tailwind', 'TypeScript', 'Dashboard'],
  ARRAY[
    'Real-time analytics dashboard',
    'Inventory management system',
    'Order tracking and management',
    'Customer relationship management',
    'Responsive design for all devices',
    'Dark/Light theme support',
    'Export data functionality',
    'Role-based access control'
  ],
  'https://demo.example.com',
  'https://github.com/example/repo',
  'Extended License',
  'Intermediate',
  ARRAY['/placeholder.svg?height=400&width=600'],
  4.9,
  1234,
  '2.1.0',
  true
),
(
  'AI Chat Assistant',
  16599.00,
  'Intelligent chatbot with natural language processing and custom training',
  'Advanced AI-powered chat assistant built with modern NLP technologies. Features include custom training capabilities, multi-language support, and seamless integration with existing systems.',
  'AI/ML Project',
  ARRAY['Python', 'OpenAI', 'FastAPI', 'React'],
  ARRAY['Python', 'OpenAI', 'FastAPI', 'AI', 'Chatbot'],
  ARRAY[
    'Natural language processing',
    'Custom training capabilities',
    'Multi-language support',
    'API integration',
    'Real-time responses',
    'Analytics dashboard'
  ],
  'https://demo-ai.example.com',
  'https://github.com/example/ai-chat',
  'Standard License',
  'Advanced',
  ARRAY['/placeholder.svg?height=400&width=600'],
  4.8,
  856,
  '1.5.0',
  false
),
(
  'Mobile Banking App',
  33249.00,
  'Secure mobile banking solution with biometric authentication',
  'Complete mobile banking application with advanced security features, biometric authentication, and seamless payment integration. Built for both iOS and Android platforms.',
  'Mobile Application',
  ARRAY['React Native', 'Node.js', 'MongoDB', 'Stripe'],
  ARRAY['React Native', 'Node.js', 'MongoDB', 'Banking', 'Mobile'],
  ARRAY[
    'Biometric authentication',
    'Secure transactions',
    'Real-time notifications',
    'Account management',
    'Payment integration',
    'Transaction history',
    'Budget tracking'
  ],
  'https://demo-banking.example.com',
  'https://github.com/example/banking-app',
  'Extended License',
  'Advanced',
  ARRAY['/placeholder.svg?height=400&width=600'],
  4.9,
  567,
  '3.0.0',
  true
),
(
  'SaaS Landing Page',
  12399.00,
  'Conversion-optimized landing page template with A/B testing',
  'Beautiful, responsive landing page template designed for SaaS companies. Features conversion optimization, A/B testing capabilities, and modern design patterns.',
  'UI Kit',
  ARRAY['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'],
  ARRAY['HTML', 'CSS', 'JavaScript', 'Landing Page'],
  ARRAY[
    'Conversion-optimized design',
    'A/B testing ready',
    'Mobile responsive',
    'Fast loading',
    'SEO optimized',
    'Easy customization'
  ],
  'https://demo-landing.example.com',
  'https://github.com/example/landing',
  'Standard License',
  'Beginner',
  ARRAY['/placeholder.svg?height=400&width=600'],
  4.7,
  2341,
  '1.3.0',
  false
),
(
  'Data Analytics Platform',
  41499.00,
  'Real-time data visualization and business intelligence dashboard',
  'Comprehensive data analytics platform with real-time visualization, business intelligence features, and advanced reporting capabilities. Perfect for data-driven organizations.',
  'Web Application',
  ARRAY['Vue.js', 'D3.js', 'Python', 'PostgreSQL'],
  ARRAY['Vue.js', 'D3.js', 'Python', 'Analytics'],
  ARRAY[
    'Real-time data visualization',
    'Business intelligence',
    'Advanced reporting',
    'Data export capabilities',
    'Custom dashboards',
    'Multi-user support'
  ],
  'https://demo-analytics.example.com',
  'https://github.com/example/analytics',
  'Extended License',
  'Expert',
  ARRAY['/placeholder.svg?height=400&width=600'],
  4.9,
  432,
  '2.0.0',
  true
),
(
  'Social Media Scheduler',
  20749.00,
  'Automated social media posting and analytics tool',
  'Complete social media management platform with automated posting, analytics, and content scheduling across multiple platforms.',
  'SaaS Platform',
  ARRAY['React', 'Express', 'PostgreSQL', 'Redis'],
  ARRAY['React', 'Express', 'PostgreSQL', 'Social Media'],
  ARRAY[
    'Multi-platform posting',
    'Content scheduling',
    'Analytics and insights',
    'Team collaboration',
    'Content calendar',
    'Automated posting'
  ],
  'https://demo-social.example.com',
  'https://github.com/example/social',
  'Commercial License',
  'Intermediate',
  ARRAY['/placeholder.svg?height=400&width=600'],
  4.6,
  789,
  '1.8.0',
  false
);
