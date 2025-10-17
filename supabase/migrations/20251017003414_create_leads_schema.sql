/*
  # Lead Magic Database Schema

  1. New Tables
    - `leads`
      - `id` (uuid, primary key) - Unique identifier for each lead
      - `phone_number` (text) - Formatted phone number (+1 format)
      - `executive_first_name` (text) - First name of the executive
      - `address` (text) - Physical address of the lead
      - `company_name` (text) - Name of the company
      - `disposition` (text) - Status: pending, interested, not_interested, unavailable, corporate
      - `notes` (text) - Additional notes about the lead
      - `created_at` (timestamptz) - When the lead was created
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `leads` table
    - Add policies for public access (since this is local-first app)
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text,
  executive_first_name text,
  address text,
  company_name text,
  disposition text DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON leads
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON leads
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON leads
  FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_leads_disposition ON leads(disposition);
CREATE INDEX IF NOT EXISTS idx_leads_company_name ON leads(company_name);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);