# Project Lessons & Rules (First Portfolio Project)

This file contains the configuration patterns, lessons, and layout rules learned during the development of the Maison Portfolio website.

## 🛠️ 1. Tech Stack & Deployment Strategy
- **Framework**: React + Vite (ESM enabled).
- **Deployment**: Vercel connected to GitHub repository ([portfolio-2026](https://github.com/ming3312/portfolio-2026)) for continuous deployment.
- **Database**: Supabase PostgreSQL database.
- **Environment Variables**:
  - Local development: Configured in [/.env.local](file:///d:/ming/portfolio/2026/First/.env.local) (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
  - Production (Vercel): Set up inside Vercel Dashboard project settings.

## 💾 2. Supabase DB Integration & Table Schema
- **Connection**: Initialized via `@supabase/supabase-js` using Vite environment variables (`import.meta.env.VITE_SUPABASE_...`).
- **Table Schema for Contacts**:
  - Table Name: `contacts`
  - Required Columns: `id` (Identity Primary Key), `created_at` (timestamptz), `name` (text), `email` (text), `category` (text), `message` (text).
- **Row Level Security (RLS)**:
  - For public portfolios requiring anonymous contact form submissions without user login, RLS should be disabled on the target table:
    ```sql
    ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
    ```

## 📱 3. Mobile Responsive Design & UI Tuning
- **GNB Header Slider**:
  - GNB slider text container width in mobile view (≤600px) must be expanded to `200px` (or enough to prevent overflow) with letter spacing set to `0.5px` and font-size to `10.5px` to prevent text truncating/wrapping issues.
- **Services Section Accordin/Title**:
  - Service title `h3` components must maintain a `line-height: 1.2;` (or inline style `lineHeight: 1.2`) to prevent line overlap during text wrap on small mobile devices.
- **Works Section browser mocks**:
  - Browser mock containers on mobile devices should have a `min-height` set dynamically and height scaled up by 20% to represent realistic phone mockups without layout compression.
