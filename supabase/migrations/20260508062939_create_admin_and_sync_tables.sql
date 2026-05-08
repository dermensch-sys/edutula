/*
  # Create Admin and Data Sync Tables

  1. New Tables
    - `admin_users` - Stores admin user data
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `is_admin` (boolean)
      - `created_at` (timestamp)
      - `last_login_at` (timestamp)
      - `preferences` (jsonb)
      - `profile` (jsonb)
      
    - `sync_queue` - Tracks local changes for sync
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `entity_type` (text) - e.g., 'user', 'learning_path', 'step'
      - `operation` (text) - 'create', 'update', 'delete'
      - `entity_id` (text)
      - `data` (jsonb)
      - `synced` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Admin users can read all admin data
    - Sync queue entries only created by system
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_login_at timestamptz DEFAULT now(),
  preferences jsonb DEFAULT '{"language":"ru","theme":"light","notifications":true,"dailyGoal":30}',
  profile jsonb DEFAULT '{"level":"advanced","interests":[],"goals":[],"studyTime":30}'
);

CREATE TABLE IF NOT EXISTS sync_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  entity_type text NOT NULL,
  operation text NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
  entity_id text NOT NULL,
  data jsonb NOT NULL,
  synced boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all admin data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'dermensch@mail.ru');

CREATE POLICY "System can manage sync queue"
  ON sync_queue FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can read unsync queue items"
  ON sync_queue FOR SELECT
  USING (synced = false OR auth.jwt() ->> 'email' = 'dermensch@mail.ru');

CREATE POLICY "System can update sync status"
  ON sync_queue FOR UPDATE
  USING (true)
  WITH CHECK (true);
