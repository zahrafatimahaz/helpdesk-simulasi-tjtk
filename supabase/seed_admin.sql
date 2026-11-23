-- Seed script to create a test admin user for the HelpDesk app
-- Run this file in the Supabase SQL editor (or via `supabase db push`).

-- 1️⃣ Ensure the pgcrypto extension is available (needed for bcrypt hashing)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2️⃣ Insert the auth user with a bcrypt‑hashed password and mark the email as confirmed
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid()                               AS id,
  'andysteve@example.com'                                     AS email,
  crypt('@#&#*$(BDjWKoEOE', gen_salt('bf'))      AS encrypted_password,  -- bcrypt hash of the password
  now()                                           AS email_confirmed_at,   -- email confirmed
  now()                                           AS created_at,
  now()                                           AS updated_at
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'andysteve');

-- 3️⃣ Insert (or update) the matching profile row and give it an admin role
INSERT INTO public.profiles (id, full_name, role)
SELECT
  u.id,
  'Andy Steve'   AS full_name,
  'SUPER_ADMIN'  AS role
FROM auth.users AS u
WHERE u.email = 'andysteve'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role      = EXCLUDED.role;

-- 4️⃣ Optional: verify that the user was created correctly
-- SELECT u.email, u.email_confirmed_at, p.full_name, p.role
-- FROM auth.users u
-- JOIN public.profiles p ON p.id = u.id
-- WHERE u.email = 'andysteve';