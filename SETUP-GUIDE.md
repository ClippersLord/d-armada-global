# D-Armada Global — Setup & Deployment Guide

## Step-by-Step: From Zero to Live Website

---

## PHASE 1: Account Setup (15 minutes)

### Step 1: Create Supabase Project
1. Go to **supabase.com** and sign up (free)
2. Click **"New Project"**
3. Name: `d-armada-global`
4. Set a strong database password (save it somewhere safe)
5. Region: Choose closest to your target audience
6. Click **Create Project** — wait ~2 minutes

### Step 2: Run Database Schema
1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase/migrations/001_initial_schema.sql` from this project
4. Copy ALL the SQL and paste it into the editor
5. Click **Run** — you should see "Success" for each statement
6. Go to **Table Editor** — you should see all tables: posts, products, orders, etc.

### Step 3: Create Your Admin Account
1. In Supabase, go to **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Enter your email and a strong password
4. Click **Create User**
5. Copy the user's **UUID** (shown in the user list)
6. Go to **SQL Editor** and run:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL_HERE';
```

### Step 4: Get Supabase API Keys
1. Go to **Settings** → **API**
2. Copy **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role** key → this is `SUPABASE_SERVICE_ROLE_KEY`
   ⚠️ NEVER share the service_role key publicly

### Step 5: Create Vercel Account
1. Go to **vercel.com** and sign up (free — use GitHub login)
2. You'll connect your code repository later

---

## PHASE 2: Local Development Setup (10 minutes)

### Step 6: Install Prerequisites
You need **Node.js** (version 18+) installed on your computer.
- Download from: **nodejs.org**
- After install, open Terminal/Command Prompt and verify:
```bash
node --version    # Should show v18.x or higher
npm --version     # Should show 9.x or higher
```

### Step 7: Setup Project Locally
1. Copy the `d-armada-global` folder to your computer
2. Open Terminal, navigate to the folder:
```bash
cd d-armada-global
```
3. Install dependencies:
```bash
npm install
```
4. Create environment file:
```bash
cp .env.example .env.local
```
5. Open `.env.local` and fill in your Supabase keys from Step 4

### Step 8: Run Locally
```bash
npm run dev
```
- Open **http://localhost:3000** in your browser
- You should see the D-Armada home page
- Go to **http://localhost:3000/admin-login** to test admin login
- Use the email/password from Step 3

---

## PHASE 3: Stripe Setup (20 minutes) — Do When Ready to Sell

### Step 9: Create Stripe Account
1. Go to **stripe.com** and sign up
2. Complete business verification (required for live payments)
3. Go to **Developers** → **API Keys**
4. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Copy **Secret key** → `STRIPE_SECRET_KEY`
6. Add both to your `.env.local`

### Step 10: Create Products in Stripe
For each EA you want to sell:
1. Go to **Products** → **Add Product**
2. Name: "D-Armada Breakout v3.0" (etc.)
3. Pricing: Set your price and billing interval (monthly/one-time)
4. Click **Save**
5. Copy the **Price ID** (starts with `price_...`)
6. In your admin panel at `/admin/products`, create the matching product and paste the Stripe Price ID

### Step 11: Setup Stripe Webhook
1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. URL: `https://YOUR-DOMAIN.com/api/webhooks/stripe`
4. Events to listen for:
   - `checkout.session.completed`
   - `charge.refunded`
5. Click **Add Endpoint**
6. Copy the **Signing Secret** → `STRIPE_WEBHOOK_SECRET`
7. Add to `.env.local`

---

## PHASE 4: Deploy to Vercel (10 minutes)

### Step 12: Push Code to GitHub
1. Create a new repository on **github.com** (private recommended)
2. In your project folder:
```bash
git init
git add .
git commit -m "Initial D-Armada Global application"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 13: Deploy on Vercel
1. Go to **vercel.com/dashboard**
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Framework: **Next.js** (auto-detected)
5. **Environment Variables** — Add ALL variables from your `.env.local`:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - STRIPE_SECRET_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - STRIPE_WEBHOOK_SECRET
   - NEXT_PUBLIC_SITE_URL
   - CONTACT_EMAIL
6. Click **Deploy**
7. Wait ~2 minutes — Vercel gives you a URL like `d-armada-global.vercel.app`

### Step 14: Connect Your Domain
1. In Vercel project → **Settings** → **Domains**
2. Add your domain (e.g., `d-armadaglobal.com`)
3. Vercel shows you DNS records to add
4. Go to your domain registrar and add those DNS records
5. Wait for DNS propagation (5 min to 48 hours)
6. Vercel automatically provisions SSL certificate

---

## PHASE 5: Content Setup

### Step 15: Configure Site Settings
1. Go to `YOUR-DOMAIN.com/admin-login`
2. Sign in with your admin credentials
3. Go to **Site Settings**
4. Fill in: Discord URL, Telegram URL, YouTube URL, Contact Email
5. Fill in Myfxbook credentials when ready
6. Click **Save Settings**

### Step 16: Create Your First Content
1. Go to **Posts & Content** → **+ New Post**
2. Choose category (e.g., "Strategy" for trading strategies)
3. Write your title, content (markdown), add video URL if applicable
4. Click **Publish** — it's now live on your site

### Step 17: Add EA Products
1. Go to **EA Products** → **+ New Product**
2. Fill in name, description, features, pricing
3. Add your Stripe Price ID
4. Optionally add vendor URL (MQL5 Market link)
5. Upload EA files to Supabase Storage for secure downloads
6. Save — product appears in the shop

---

## Ongoing Workflow

### To publish new research/blog/strategy:
Admin Panel → Posts → New Post → Write → Publish

### To update EA products:
Admin Panel → Products → Edit → Save

### To check contact messages:
Admin Panel → Contact Messages

### To update community links:
Admin Panel → Settings → Update URLs → Save

### To add leaderboard entries:
Admin Panel → Leaderboard → Add Entry

---

## Troubleshooting

**"Unauthorized" on admin pages:** Make sure your profile has `role = 'admin'` in the database.

**Stripe checkout not working:** Verify all 3 Stripe env vars are set correctly in Vercel.

**Posts not showing on public site:** Make sure `is_published` is TRUE in the post editor.

**Myfxbook data not loading:** Session tokens expire — regenerate from the Myfxbook API login endpoint.

**Domain not connecting:** DNS propagation can take up to 48 hours. Check with `dig YOUR-DOMAIN.com` command.
