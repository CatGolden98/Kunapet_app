/*
  # Kunapet Marketplace Core Schema

  ## Overview
  Complete database schema for Kunapet marketplace including users, pets, providers,
  services, products, bookings, loyalty system, and premium memberships.

  ## 1. New Tables

  ### Users & Authentication
  - `profiles` - User profile information
    - `id` (uuid, primary key, references auth.users)
    - `email` (text)
    - `full_name` (text)
    - `phone` (text)
    - `avatar_url` (text)
    - `user_type` (text) - 'customer' or 'provider'
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### Pets Management
  - `pets` - Pet profiles owned by users
    - `id` (uuid, primary key)
    - `owner_id` (uuid, references profiles)
    - `name` (text)
    - `species` (text) - 'dog', 'cat', 'other'
    - `breed` (text)
    - `age` (integer)
    - `weight` (decimal)
    - `photo_url` (text)
    - `medical_notes` (text)
    - `created_at` (timestamptz)

  ### Providers & Services
  - `providers` - Service provider profiles
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `business_name` (text)
    - `description` (text)
    - `logo_url` (text)
    - `rating` (decimal)
    - `total_reviews` (integer)
    - `verified` (boolean)
    - `ong_alliance` (boolean)
    - `ong_details` (jsonb)
    - `latitude` (decimal)
    - `longitude` (decimal)
    - `address` (text)
    - `delivery_available` (boolean)
    - `delivery_zones` (jsonb)
    - `created_at` (timestamptz)

  - `services` - Services offered by providers
    - `id` (uuid, primary key)
    - `provider_id` (uuid, references providers)
    - `category` (text) - 'veterinary', 'walking', 'grooming', etc.
    - `name` (text)
    - `description` (text)
    - `price` (decimal)
    - `duration_minutes` (integer)
    - `species_allowed` (text[])
    - `photos` (text[])
    - `active` (boolean)
    - `created_at` (timestamptz)

  ### Products & Shop
  - `products` - Products in Kunapet Shop
    - `id` (uuid, primary key)
    - `provider_id` (uuid, references providers)
    - `category` (text) - 'pastry', 'costumes', 'accessories', 'food', etc.
    - `name` (text)
    - `description` (text)
    - `price` (decimal)
    - `discount_percentage` (integer)
    - `stock` (integer)
    - `photos` (text[])
    - `trending` (boolean)
    - `featured` (boolean)
    - `species` (text[])
    - `created_at` (timestamptz)

  ### Bookings & Orders
  - `bookings` - Service bookings and product orders
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `provider_id` (uuid, references providers)
    - `booking_type` (text) - 'service' or 'product'
    - `service_id` (uuid, references services)
    - `product_id` (uuid, references products)
    - `pet_id` (uuid, references pets)
    - `status` (text) - 'pending', 'confirmed', 'completed', 'cancelled'
    - `scheduled_date` (timestamptz)
    - `total_amount` (decimal)
    - `kunapuntos_used` (integer)
    - `payment_status` (text)
    - `delivery_address` (text)
    - `notes` (text)
    - `created_at` (timestamptz)

  ### Loyalty System
  - `kunapuntos` - Points transaction history
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `points` (integer)
    - `transaction_type` (text) - 'earned', 'redeemed', 'bonus'
    - `booking_id` (uuid, references bookings)
    - `description` (text)
    - `created_at` (timestamptz)

  - `kunapuntos_rewards` - Reward catalog
    - `id` (uuid, primary key)
    - `name` (text)
    - `description` (text)
    - `points_required` (integer)
    - `discount_percentage` (integer)
    - `active` (boolean)
    - `created_at` (timestamptz)

  ### Premium Memberships
  - `memberships` - User premium memberships
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `plan_type` (text) - 'free', 'monthly', 'annual'
    - `status` (text) - 'active', 'cancelled', 'expired'
    - `start_date` (timestamptz)
    - `end_date` (timestamptz)
    - `auto_renew` (boolean)
    - `created_at` (timestamptz)

  ### Reviews & Ratings
  - `reviews` - Service and product reviews
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `provider_id` (uuid, references providers)
    - `booking_id` (uuid, references bookings)
    - `rating` (integer)
    - `comment` (text)
    - `verified` (boolean)
    - `created_at` (timestamptz)

  ### Provider Training
  - `training_courses` - Available training courses
    - `id` (uuid, primary key)
    - `title` (text)
    - `description` (text)
    - `category` (text)
    - `duration_hours` (integer)
    - `content_url` (text)
    - `created_at` (timestamptz)

  - `provider_training` - Provider training progress
    - `id` (uuid, primary key)
    - `provider_id` (uuid, references providers)
    - `course_id` (uuid, references training_courses)
    - `progress_percentage` (integer)
    - `completed` (boolean)
    - `certificate_url` (text)
    - `completed_at` (timestamptz)
    - `created_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Create restrictive policies for authenticated users
  - Users can only access their own data
  - Providers can manage their own services/products
  - Public read access for services and products

  ## 3. Indexes
  - Added indexes for common queries
  - Geolocation indexes for provider search
  - Performance optimization for filtering
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  user_type text NOT NULL DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  age integer,
  weight decimal,
  photo_url text,
  medical_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own pets"
  ON pets FOR ALL
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  business_name text NOT NULL,
  description text,
  logo_url text,
  rating decimal DEFAULT 0,
  total_reviews integer DEFAULT 0,
  verified boolean DEFAULT false,
  ong_alliance boolean DEFAULT false,
  ong_details jsonb,
  latitude decimal,
  longitude decimal,
  address text,
  delivery_available boolean DEFAULT false,
  delivery_zones jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view providers"
  ON providers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Providers can manage own profile"
  ON providers FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  description text,
  price decimal NOT NULL,
  duration_minutes integer,
  species_allowed text[] DEFAULT '{}',
  photos text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Providers can manage own services"
  ON services FOR ALL
  TO authenticated
  USING (provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()))
  WITH CHECK (provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()));

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  description text,
  price decimal NOT NULL,
  discount_percentage integer DEFAULT 0,
  stock integer DEFAULT 0,
  photos text[] DEFAULT '{}',
  trending boolean DEFAULT false,
  featured boolean DEFAULT false,
  species text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Providers can manage own products"
  ON products FOR ALL
  TO authenticated
  USING (provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()))
  WITH CHECK (provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()));

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES providers ON DELETE CASCADE,
  booking_type text NOT NULL,
  service_id uuid REFERENCES services ON DELETE SET NULL,
  product_id uuid REFERENCES products ON DELETE SET NULL,
  pet_id uuid REFERENCES pets ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  scheduled_date timestamptz,
  total_amount decimal NOT NULL,
  kunapuntos_used integer DEFAULT 0,
  payment_status text DEFAULT 'pending',
  delivery_address text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()));

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users and providers can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()))
  WITH CHECK (user_id = auth.uid() OR provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()));

-- Create kunapuntos table
CREATE TABLE IF NOT EXISTS kunapuntos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  points integer NOT NULL,
  transaction_type text NOT NULL,
  booking_id uuid REFERENCES bookings ON DELETE SET NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE kunapuntos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own points"
  ON kunapuntos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create point transactions"
  ON kunapuntos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create kunapuntos_rewards table
CREATE TABLE IF NOT EXISTS kunapuntos_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points_required integer NOT NULL,
  discount_percentage integer NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE kunapuntos_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active rewards"
  ON kunapuntos_rewards FOR SELECT
  TO authenticated
  USING (active = true);

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  plan_type text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  auto_renew boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own membership"
  ON memberships FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own membership"
  ON memberships FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES providers ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for own bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create training_courses table
CREATE TABLE IF NOT EXISTS training_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  duration_hours integer,
  content_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can view courses"
  ON training_courses FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'provider'));

-- Create provider_training table
CREATE TABLE IF NOT EXISTS provider_training (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES providers ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES training_courses ON DELETE CASCADE,
  progress_percentage integer DEFAULT 0,
  completed boolean DEFAULT false,
  certificate_url text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE provider_training ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can manage own training"
  ON provider_training FOR ALL
  TO authenticated
  USING (provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()))
  WITH CHECK (provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_providers_location ON providers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON providers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(trending);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_kunapuntos_user ON kunapuntos(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);