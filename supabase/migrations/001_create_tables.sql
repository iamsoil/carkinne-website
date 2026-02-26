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
  fuel_type TEXT CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
  transmission TEXT CHECK (transmission IN ('Manual', 'Automatic')),
  mileage_kmpl DECIMAL,
  seating INTEGER,
  colors TEXT[],
  images TEXT[],
  features TEXT[],
  category TEXT CHECK (category IN ('SUV', 'Sedan', 'Hatchback', 'MUV', 'Van', 'Pickup')),
  is_electric BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_discontinued BOOLEAN DEFAULT false,
  price_on_request BOOLEAN DEFAULT false,
  battery_range_km INTEGER,
  source_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS
ALTER TABLE public.showrooms ENABLE ROW LEVEL SECURITY;

-- Create offers table
CREATE TABLE public.offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  car_id UUID REFERENCES cars(id),
  discount_amount INTEGER,
  valid_until DATE,
  image_url TEXT,
  offer_type TEXT CHECK (offer_type IN ('Cash', 'Accessories', 'Warranty', 'Finance'))
);

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create price_history table
CREATE TABLE public.price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES cars(id),
  old_price INTEGER,
  new_price INTEGER,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Create price_alerts table
CREATE TABLE public.price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  car_id UUID REFERENCES cars(id),
  target_price INTEGER,
  is_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for cars table
CREATE POLICY "cars_select_policy" ON public.cars
FOR SELECT USING (true);

-- Create policies for brands table
CREATE POLICY "brands_select_policy" ON public.brands
FOR SELECT USING (true);

-- Create policies for showrooms table
CREATE POLICY "showrooms_select_policy" ON public.showrooms
FOR SELECT USING (true);

-- Create policies for offers table
CREATE POLICY "offers_select_policy" ON public.offers
FOR SELECT USING (true);

-- Create policies for blog_posts table
CREATE POLICY "blog_posts_select_policy" ON public.blog_posts
FOR SELECT USING (is_published = true);

-- Create policies for price_history table
CREATE POLICY "price_history_select_policy" ON public.price_history
FOR SELECT USING (true);

-- Create policies for price_alerts table
CREATE POLICY "price_alerts_insert_policy" ON public.price_alerts
FOR INSERT WITH CHECK (true);