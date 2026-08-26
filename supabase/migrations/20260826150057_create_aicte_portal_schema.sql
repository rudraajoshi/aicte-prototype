/*
# Create AICTE Approval Portal Schema

This migration creates the complete database schema for the AICTE Approval Portal prototype.

1. New Tables
- `applications` — Stores institution application data including documents, timeline stages, compliance score, AI verification status, and assigned evaluator. Single shared row for the prototype.
- `evaluators` — Stores evaluator profiles with name, expertise, assigned status, and match score.
- `support_requests` — Stores support requests submitted by institutions from the AI Document Help panel.
- `evaluator_reviews` — Stores evaluator decisions (Approve/Needs More Info/Reject) with comments.

2. Security
- All tables have RLS enabled.
- Policies allow anon + authenticated CRUD since this is a single-tenant prototype with demo login (no real auth).
- `USING (true)` is used because the data is intentionally shared/public for the demo.

3. Important Notes
- The `applications` table stores mutable state as JSONB columns (documents, stages, ai_findings) for flexibility.
- A seed row is inserted into `applications` with default prototype data.
- Three evaluators are seeded into `evaluators`.
*/

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name text NOT NULL DEFAULT 'National Institute of Technology',
  application_id text NOT NULL DEFAULT 'AICTE-2024-00342',
  status text NOT NULL DEFAULT 'Documents Pending',
  compliance_score integer NOT NULL DEFAULT 84,
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  stages jsonb NOT NULL DEFAULT '[]'::jsonb,
  ai_findings jsonb NOT NULL DEFAULT '[]'::jsonb,
  compliance_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  assigned_evaluator_id uuid,
  evaluator_review jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_applications" ON applications;
CREATE POLICY "anon_select_applications" ON applications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_applications" ON applications;
CREATE POLICY "anon_insert_applications" ON applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_applications" ON applications;
CREATE POLICY "anon_update_applications" ON applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_applications" ON applications;
CREATE POLICY "anon_delete_applications" ON applications FOR DELETE
  TO anon, authenticated USING (true);

-- Evaluators table
CREATE TABLE IF NOT EXISTS evaluators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  expertise text NOT NULL,
  experience text NOT NULL,
  match_score integer NOT NULL DEFAULT 85,
  assigned boolean NOT NULL DEFAULT false,
  assigned_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evaluators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_evaluators" ON evaluators;
CREATE POLICY "anon_select_evaluators" ON evaluators FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_evaluators" ON evaluators;
CREATE POLICY "anon_insert_evaluators" ON evaluators FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_evaluators" ON evaluators;
CREATE POLICY "anon_update_evaluators" ON evaluators FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_evaluators" ON evaluators;
CREATE POLICY "anon_delete_evaluators" ON evaluators FOR DELETE
  TO anon, authenticated USING (true);

-- Support requests table
CREATE TABLE IF NOT EXISTS support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id text,
  document_name text NOT NULL,
  issue_type text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_support_requests" ON support_requests;
CREATE POLICY "anon_select_support_requests" ON support_requests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_support_requests" ON support_requests;
CREATE POLICY "anon_insert_support_requests" ON support_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_support_requests" ON support_requests;
CREATE POLICY "anon_update_support_requests" ON support_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_support_requests" ON support_requests;
CREATE POLICY "anon_delete_support_requests" ON support_requests FOR DELETE
  TO anon, authenticated USING (true);

-- Evaluator reviews table
CREATE TABLE IF NOT EXISTS evaluator_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id text NOT NULL,
  evaluator_id uuid,
  decision text NOT NULL,
  comments text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evaluator_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_evaluator_reviews" ON evaluator_reviews;
CREATE POLICY "anon_select_evaluator_reviews" ON evaluator_reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_evaluator_reviews" ON evaluator_reviews;
CREATE POLICY "anon_insert_evaluators_reviews" ON evaluator_reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_evaluator_reviews" ON evaluator_reviews;
CREATE POLICY "anon_update_evaluator_reviews" ON evaluator_reviews FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_evaluator_reviews" ON evaluator_reviews;
CREATE POLICY "anon_delete_evaluator_reviews" ON evaluator_reviews FOR DELETE
  TO anon, authenticated USING (true);

-- Seed default application data
INSERT INTO applications (id, institution_name, application_id, status, compliance_score, documents, stages, ai_findings, compliance_items)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'National Institute of Technology',
  'AICTE-2024-00342',
  'Documents Pending',
  84,
  '[
    {"id":"doc1","name":"Institution Proposal","status":"verified","uploadedAt":"2024-01-15","pages":12,"type":"PDF"},
    {"id":"doc2","name":"Land Documents","status":"verified","uploadedAt":"2024-01-15","pages":8,"type":"PDF"},
    {"id":"doc3","name":"Building Plan","status":"verified","uploadedAt":"2024-01-16","pages":15,"type":"PDF"},
    {"id":"doc4","name":"Faculty List","status":"pending","uploadedAt":null,"pages":0,"type":"PDF"},
    {"id":"doc5","name":"Financial Statements","status":"pending","uploadedAt":null,"pages":0,"type":"PDF"},
    {"id":"doc6","name":"Affiliation Letter","status":"verified","uploadedAt":"2024-01-14","pages":5,"type":"PDF"},
    {"id":"doc7","name":"NOC from State Government","status":"pending","uploadedAt":null,"pages":0,"type":"PDF"},
    {"id":"doc8","name":"Anti-Ragging Policy","status":"verified","uploadedAt":"2024-01-17","pages":3,"type":"PDF"}
  ]'::jsonb,
  '[
    {"id":"stage1","title":"Initial Submission","status":"complete","date":"Jan 15, 2024","description":"Application submitted with basic documents"},
    {"id":"stage2","title":"Document Verification","status":"complete","date":"Jan 18, 2024","description":"AI-powered document verification completed"},
    {"id":"stage3","title":"Compliance Analysis","status":"complete","date":"Jan 20, 2024","description":"AI compliance check completed - 84% score"},
    {"id":"stage4","title":"Evaluator Assignment","status":"current","date":"In Progress","description":"Awaiting evaluator assignment"},
    {"id":"stage5","title":"Evaluator Review","status":"pending","date":"Pending","description":"Evaluator review and site visit"},
    {"id":"stage6","title":"Final Decision","status":"pending","date":"Pending","description":"AICTE committee final decision"}
  ]'::jsonb,
  '[
    {"id":"f1","document":"Faculty List","type":"missing_document","severity":"high","title":"Faculty List Not Uploaded","description":"The faculty list document is required but has not been uploaded yet."},
    {"id":"f2","document":"Financial Statements","type":"missing_document","severity":"high","title":"Financial Statements Missing","description":"Financial statements for the last 3 years are required for verification."},
    {"id":"f3","document":"Faculty List","type":"data_issue","severity":"medium","title":"Faculty Experience Below Requirement","description":"5 faculty members have less than 3 years of teaching experience. Minimum 5 years is required for senior positions."}
  ]'::jsonb,
  '[
    {"id":"c1","title":"Land Requirement","status":"compliant","score":100,"description":"5 acres of land available (minimum 2 acres required)","details":"The institution has 5 acres of land which exceeds the minimum requirement of 2 acres for technical institutions."},
    {"id":"c2","title":"Building & Infrastructure","status":"compliant","score":95,"description":"Built-up area 8000 sq.m (minimum 5000 sq.m required)","details":"The built-up area meets and exceeds the minimum requirement. Classrooms, laboratories, and library are adequately sized."},
    {"id":"c3","title":"Faculty Qualification","status":"warning","score":70,"description":"70% faculty with PhD (minimum 80% required for PG programs)","details":"Currently 70% of faculty members hold PhD qualifications. The minimum requirement is 80% for institutions offering postgraduate programs. 5 faculty members need to complete their PhD."},
    {"id":"c4","title":"Financial Stability","status":"non-compliant","score":0,"description":"Financial statements not submitted","details":"Financial statements for the last 3 years are required to demonstrate financial stability. This is a mandatory document that has not been uploaded."}
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed evaluators
INSERT INTO evaluators (id, name, expertise, experience, match_score, assigned)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Dr. Rajesh Kumar', 'Technical Education, Engineering', '15 years', 94, false),
  ('e0000000-0000-0000-0000-000000000002', 'Dr. Priya Sharma', 'Infrastructure, Compliance', '12 years', 89, false),
  ('e0000000-0000-0000-0000-000000000003', 'Dr. Amit Patel', 'Financial Audit, Governance', '18 years', 82, false)
ON CONFLICT (id) DO NOTHING;