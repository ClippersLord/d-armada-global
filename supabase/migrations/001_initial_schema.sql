-- D-Armada Global — Initial Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (Admin users linked to Supabase Auth)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, display_name)
  VALUES (NEW.id, NEW.email, 'viewer', COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- POSTS (All CMS content)
-- ============================================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  body TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  category TEXT NOT NULL CHECK (category IN (
    'research', 'blog', 'strategy', 'risk-framework',
    'macro-context', 'tech-lab', 'course', 'live-session', 'investor'
  )),
  subcategory TEXT,
  video_url TEXT,
  image_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'D-Armada Global',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC);

-- ============================================================
-- PRODUCTS (EA Shop)
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  billing_interval TEXT DEFAULT 'month' CHECK (billing_interval IN ('month', 'year', 'one_time')),
  stripe_price_id TEXT,
  stripe_product_id TEXT,
  features TEXT[] DEFAULT '{}',
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'flagship', 'bundle')),
  download_url TEXT,
  vendor_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  version TEXT DEFAULT '1.0',
  changelog TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDERS (Purchase records)
-- ============================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_email TEXT NOT NULL,
  customer_name TEXT DEFAULT '',
  product_id UUID REFERENCES products(id),
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT DEFAULT '',
  message TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SITE SETTINGS (Key-value config)
-- ============================================================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('discord_url', ''),
  ('telegram_url', ''),
  ('youtube_url', ''),
  ('contact_email', ''),
  ('myfxbook_account_id', ''),
  ('myfxbook_session', ''),
  ('site_title', 'D-Armada Global'),
  ('site_description', 'Institutional-grade research. Battle-tested algorithms. Education that transforms retail traders into systematic operators.');

-- ============================================================
-- LEADERBOARD ENTRIES
-- ============================================================
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trader_name TEXT NOT NULL,
  account_type TEXT DEFAULT 'prop_firm' CHECK (account_type IN ('prop_firm', 'personal')),
  month TEXT NOT NULL,
  pnl_percent DECIMAL(8,2) DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  max_drawdown DECIMAL(8,2) DEFAULT 0,
  ea_used TEXT DEFAULT '',
  verified BOOLEAN DEFAULT FALSE,
  myfxbook_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_month ON leaderboard_entries(month DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES: users can read own, admin can read all
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (is_admin());

-- POSTS: public reads published, admin full access
CREATE POLICY "Public reads published posts" ON posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admin full access posts" ON posts FOR ALL USING (is_admin());

-- PRODUCTS: public reads active, admin full access
CREATE POLICY "Public reads active products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin full access products" ON products FOR ALL USING (is_admin());

-- ORDERS: admin only
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (is_admin());
-- Allow inserts from API (service role bypasses RLS, but add policy for webhook)
CREATE POLICY "Service creates orders" ON orders FOR INSERT WITH CHECK (TRUE);

-- CONTACT: anyone can insert, admin reads
CREATE POLICY "Anyone can submit contact" ON contact_submissions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin reads contacts" ON contact_submissions FOR SELECT USING (is_admin());
CREATE POLICY "Admin updates contacts" ON contact_submissions FOR UPDATE USING (is_admin());

-- SITE SETTINGS: public reads, admin writes
CREATE POLICY "Public reads settings" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admin writes settings" ON site_settings FOR ALL USING (is_admin());

-- LEADERBOARD: public reads, admin writes
CREATE POLICY "Public reads leaderboard" ON leaderboard_entries FOR SELECT USING (TRUE);
CREATE POLICY "Admin full access leaderboard" ON leaderboard_entries FOR ALL USING (is_admin());

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
