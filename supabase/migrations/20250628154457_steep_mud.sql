/*
  # Enhanced Lab Work System

  1. New Tables
    - `lab_work_communications` - Track communications with lab
    - `lab_work_revisions` - Track revision requests and changes
    - `lab_contacts` - Store laboratory contact information
    - `lab_work_templates` - Common lab work templates

  2. Enhanced Features
    - Communication tracking
    - Revision management
    - Lab contact management
    - Template system for common procedures
    - Quality tracking
    - Delivery confirmation

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for authenticated users
*/

-- Lab contacts table for managing laboratory information
CREATE TABLE IF NOT EXISTS lab_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_name text NOT NULL,
  contact_person text,
  phone text,
  email text,
  address text,
  specialties text[],
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lab_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage lab contacts"
  ON lab_contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Lab work communications table
CREATE TABLE IF NOT EXISTS lab_work_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_work_id uuid NOT NULL REFERENCES lab_work(id) ON DELETE CASCADE,
  communication_type text NOT NULL CHECK (communication_type IN ('email', 'phone', 'message', 'visit')),
  direction text NOT NULL CHECK (direction IN ('outgoing', 'incoming')),
  subject text,
  message text NOT NULL,
  contact_person text,
  communication_date timestamptz DEFAULT now(),
  follow_up_required boolean DEFAULT false,
  follow_up_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_work_communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage lab communications"
  ON lab_work_communications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Lab work revisions table
CREATE TABLE IF NOT EXISTS lab_work_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_work_id uuid NOT NULL REFERENCES lab_work(id) ON DELETE CASCADE,
  revision_number integer NOT NULL DEFAULT 1,
  reason text NOT NULL,
  description text NOT NULL,
  requested_date date DEFAULT CURRENT_DATE,
  expected_completion_date date,
  actual_completion_date date,
  revision_status text DEFAULT 'requested' CHECK (revision_status IN ('requested', 'in_progress', 'completed', 'rejected')),
  additional_cost numeric(10,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lab_work_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage lab revisions"
  ON lab_work_revisions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Lab work templates table
CREATE TABLE IF NOT EXISTS lab_work_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  lab_type text NOT NULL,
  default_description text NOT NULL,
  default_instructions text,
  estimated_days integer,
  estimated_cost numeric(10,2),
  materials_list text[],
  special_requirements text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lab_work_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage lab templates"
  ON lab_work_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add some useful columns to existing lab_work table
DO $$
BEGIN
  -- Add quality rating column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_work' AND column_name = 'quality_rating'
  ) THEN
    ALTER TABLE lab_work ADD COLUMN quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5);
  END IF;

  -- Add delivery confirmation
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_work' AND column_name = 'delivery_confirmed'
  ) THEN
    ALTER TABLE lab_work ADD COLUMN delivery_confirmed boolean DEFAULT false;
  END IF;

  -- Add delivery confirmation date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_work' AND column_name = 'delivery_confirmed_date'
  ) THEN
    ALTER TABLE lab_work ADD COLUMN delivery_confirmed_date timestamptz;
  END IF;

  -- Add priority level
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_work' AND column_name = 'priority'
  ) THEN
    ALTER TABLE lab_work ADD COLUMN priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
  END IF;

  -- Add lab contact reference
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_work' AND column_name = 'lab_contact_id'
  ) THEN
    ALTER TABLE lab_work ADD COLUMN lab_contact_id uuid REFERENCES lab_contacts(id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lab_work_communications_lab_work_id ON lab_work_communications(lab_work_id);
CREATE INDEX IF NOT EXISTS idx_lab_work_communications_date ON lab_work_communications(communication_date);
CREATE INDEX IF NOT EXISTS idx_lab_work_revisions_lab_work_id ON lab_work_revisions(lab_work_id);
CREATE INDEX IF NOT EXISTS idx_lab_work_revisions_status ON lab_work_revisions(revision_status);
CREATE INDEX IF NOT EXISTS idx_lab_contacts_active ON lab_contacts(is_active);
CREATE INDEX IF NOT EXISTS idx_lab_work_priority ON lab_work(priority);
CREATE INDEX IF NOT EXISTS idx_lab_work_delivery ON lab_work(delivery_confirmed);

-- Insert some sample lab contacts
INSERT INTO lab_contacts (lab_name, contact_person, phone, email, specialties) VALUES
  ('Premium Dental Lab', 'John Smith', '+91 9876543210', 'contact@premiumdentallab.com', ARRAY['Crown & Bridge', 'Dentures', 'Implants']),
  ('Advanced Prosthetics Lab', 'Sarah Johnson', '+91 9876543211', 'info@advancedprosthetics.com', ARRAY['Orthodontics', 'Night Guards', 'Surgical Guides']),
  ('Digital Dental Solutions', 'Mike Wilson', '+91 9876543212', 'support@digitaldentallab.com', ARRAY['CAD/CAM', 'Implant Crowns', 'Veneers'])
ON CONFLICT DO NOTHING;

-- Insert some sample lab work templates
INSERT INTO lab_work_templates (template_name, lab_type, default_description, default_instructions, estimated_days, estimated_cost) VALUES
  ('Standard Crown', 'Crown & Bridge', 'Single crown fabrication', 'Please ensure proper margins and contact points', 7, 150.00),
  ('Complete Denture', 'Dentures (Complete)', 'Full upper and lower denture set', 'Patient requires multiple fittings', 14, 800.00),
  ('Night Guard', 'Night Guard', 'Custom night guard for bruxism', 'Soft material preferred, 2mm thickness', 5, 120.00),
  ('Implant Crown', 'Implant Crown', 'Implant-supported crown', 'Verify implant platform and angulation', 10, 200.00)
ON CONFLICT DO NOTHING;

-- Update trigger for lab_work_revisions
CREATE OR REPLACE FUNCTION update_lab_work_revisions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lab_work_revisions_updated_at
  BEFORE UPDATE ON lab_work_revisions
  FOR EACH ROW
  EXECUTE FUNCTION update_lab_work_revisions_updated_at();

-- Update trigger for lab_work_templates
CREATE TRIGGER update_lab_work_templates_updated_at
  BEFORE UPDATE ON lab_work_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update trigger for lab_contacts
CREATE TRIGGER update_lab_contacts_updated_at
  BEFORE UPDATE ON lab_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();