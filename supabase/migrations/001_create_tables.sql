-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  gender TEXT,
  age INTEGER,
  height INTEGER,
  weight INTEGER,
  activity_level TEXT,
  health_checkup TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_records table
CREATE TABLE public.meal_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  foods TEXT[] NOT NULL,
  image_url TEXT,
  calories INTEGER,
  nutrients JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nutrition_analysis table
CREATE TABLE public.nutrition_analysis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  analysis_date DATE NOT NULL,
  nutrients JSONB NOT NULL,
  deficiencies TEXT[] NOT NULL DEFAULT '{}',
  recommendations TEXT[] NOT NULL DEFAULT '{}',
  balance_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coaching_messages table
CREATE TABLE public.coaching_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  type TEXT CHECK (type IN ('user', 'coach', 'system')) NOT NULL,
  content TEXT NOT NULL,
  coach_type TEXT,
  meal_data JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Meal records policies
CREATE POLICY "Users can view own meal records" ON public.meal_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal records" ON public.meal_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal records" ON public.meal_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal records" ON public.meal_records
  FOR DELETE USING (auth.uid() = user_id);

-- Nutrition analysis policies
CREATE POLICY "Users can view own nutrition analysis" ON public.nutrition_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition analysis" ON public.nutrition_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Coaching messages policies
CREATE POLICY "Users can view own coaching messages" ON public.coaching_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coaching messages" ON public.coaching_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_meal_records_user_id ON public.meal_records(user_id);
CREATE INDEX idx_meal_records_created_at ON public.meal_records(created_at);
CREATE INDEX idx_nutrition_analysis_user_id ON public.nutrition_analysis(user_id);
CREATE INDEX idx_nutrition_analysis_date ON public.nutrition_analysis(analysis_date);
CREATE INDEX idx_coaching_messages_user_id ON public.coaching_messages(user_id);
CREATE INDEX idx_coaching_messages_created_at ON public.coaching_messages(created_at);