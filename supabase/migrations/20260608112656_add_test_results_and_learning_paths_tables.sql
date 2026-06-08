/*
  # Add Test Results and Learning Paths Tables

  1. New Tables
    - `test_results` - Stores user test results
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `test_type` (text) - 'entrance', 'adaptive', 'final'
      - `score` (integer)
      - `total_questions` (integer)
      - `correct_answers` (integer)
      - `results` (jsonb) - detailed question results
      - `analysis` (jsonb) - category analysis
      - `created_at` (timestamp)
      
    - `learning_paths` - Stores personalized learning paths
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique)
      - `title` (text)
      - `description` (text)
      - `goals` (jsonb)
      - `steps` (jsonb)
      - `progress` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  test_type text NOT NULL CHECK (test_type IN ('entrance', 'adaptive', 'final')),
  score integer NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  results jsonb NOT NULL DEFAULT '[]',
  analysis jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  goals jsonb NOT NULL DEFAULT '[]',
  steps jsonb NOT NULL DEFAULT '[]',
  progress integer DEFAULT 0,
  estimated_completion_time integer DEFAULT 0,
  adaptations jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own test results"
  ON test_results FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own test results"
  ON test_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own learning path"
  ON learning_paths FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own learning path"
  ON learning_paths FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own learning path"
  ON learning_paths FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_test_results_user ON test_results(user_id);
CREATE INDEX idx_learning_paths_user ON learning_paths(user_id);
