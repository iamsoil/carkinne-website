-- Create brands table
CREATE TABLE public.brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  slug TEXT UNIQUE,
  logo_url TEXT,
  distributor_name TEXT,
  website TEXT,
  established_year INTEGER
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create secure policies for brands
CREATE POLICY "brands_select_policy" ON public.brands
FOR SELECT TO authenticated USING (true);

CREATE POLICY "brands_insert_policy" ON public.brands
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "brands_update_policy" ON public.brands
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "brands_delete_policy" ON public.brands
FOR DELETE TO authenticated USING (true);

-- Create cars table
CREATE TABLE public.cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT,
  year INTEGER DEFAULT 2025,
  variant TEXT,
  ex_showroom_price INTEGER,
  on_road_price INTEGER,
  price_on_request BOOLEAN DEFAULT false,
  engine_cc INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  mileage_kmpl DECIMAL,
  seating INTEGER,
  colors TEXT[],
  images TEXT[],
  features TEXT[],
  category TEXT,
  is_electric BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_discontinued BOOLEAN DEFAULT false,
  battery_range_km INTEGER,
  source_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Create secure policies for cars
CREATE POLICY "cars_select_policy" ON public.cars
FOR SELECT TO authenticated USING (true);

CREATE POLICY "cars_insert_policy" ON public.cars
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "cars_update_policy" ON public.cars
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "cars_delete_policy" ON public.cars
FOR DELETE TO authenticated USING (true);

-- Create showrooms table
CREATE TABLE public.showrooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT,
  name TEXT,
  address TEXT,
  city TEXT,
  phone TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  google_maps_url TEXT,
  working_hours TEXT,
  is_authorized BOOLEAN DEFAULT true
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.showrooms ENABLE ROW LEVEL SECURITY;

-- Create secure policies for showrooms
CREATE POLICY "showrooms_select_policy" ON public.showrooms
FOR SELECT TO authenticated USING (true);

CREATE POLICY "showrooms_insert_policy" ON public.showrooms
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "showrooms_update_policy" ON public.showrooms
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "showrooms_delete_policy" ON public.showrooms
FOR DELETE TO authenticated USING (true);

-- Create offers table
CREATE TABLE public.offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  car_id UUID REFERENCES cars(id),
  discount_amount INTEGER,
  valid_until DATE,
  image_url TEXT,
  offer_type TEXT
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Create secure policies for offers
CREATE POLICY "offers_select_policy" ON public.offers
FOR SELECT TO authenticated USING (true);

CREATE POLICY "offers_insert_policy" ON public.offers
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "offers_update_policy" ON public.offers
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "offers_delete_policy" ON public.offers
FOR DELETE TO authenticated USING (true);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  category TEXT,
  cover_image TEXT,
  author TEXT DEFAULT 'CarKinne Team',
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create secure policies for blog_posts
CREATE POLICY "blog_posts_select_policy" ON public.blog_posts
FOR SELECT TO authenticated USING (true);

CREATE POLICY "blog_posts_insert_policy" ON public.blog_posts
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "blog_posts_update_policy" ON public.blog_posts
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "blog_posts_delete_policy" ON public.blog_posts
FOR DELETE TO authenticated USING (true);

-- Create price_history table
CREATE TABLE public.price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES cars(id),
  old_price INTEGER,
  new_price INTEGER,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Create secure policies for price_history
CREATE POLICY "price_history_select_policy" ON public.price_history
FOR SELECT TO authenticated USING (true);

CREATE POLICY "price_history_insert_policy" ON public.price_history
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "price_history_update_policy" ON public.price_history
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "price_history_delete_policy" ON public.price_history
FOR DELETE TO authenticated USING (true);

-- Create price_alerts table
CREATE TABLE public.price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  car_id UUID REFERENCES cars(id),
  target_price INTEGER,
  is_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Create secure policies for price_alerts
CREATE POLICY "price_alerts_select_policy" ON public.price_alerts
FOR SELECT TO authenticated USING (true);

CREATE POLICY "price_alerts_insert_policy" ON public.price_alerts
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "price_alerts_update_policy" ON public.price_alerts
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "price_alerts_delete_policy" ON public.price_alerts
FOR DELETE TO authenticated USING (true);