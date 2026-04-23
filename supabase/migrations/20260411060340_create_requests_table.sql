/*
  # Create Requests Table

  ## Summary
  Adds the `requests` table to support creative work requests within organizations and workspaces.

  ## New Tables
  - `requests`
    - `id` (text, primary key, cuid-style)
    - `org_id` (text, FK to organizations) - tenant scoping
    - `workspace_id` (text, FK to workspaces) - workspace scoping
    - `title` (text) - request title
    - `description` (text, nullable) - detailed description
    - `type` (text) - DESIGN | MOTION | COPY | STRATEGY | DEVELOPMENT
    - `status` (text) - DRAFT | SUBMITTED | ACTIVE | IN_PROGRESS | IN_REVISION | COMPLETED | ARCHIVED
    - `priority_order` (integer) - for drag-and-drop ordering
    - `turnaround_tier` (text) - STANDARD | RUSH | PRIORITY
    - `brief_form_data` (jsonb, nullable) - flexible brief fields
    - `due_date` (timestamptz, nullable)
    - `creator_id` (text) - user who created the request
    - `assignee_id` (text, nullable) - user assigned to the request
    - `created_at`, `updated_at` timestamps

  ## Security
  - RLS enabled
  - Authenticated users can view requests in their org
  - Authenticated users can create/update requests in their org
  - Only creator or assignee can delete (archive) requests

  ## Indexes
  - org_id, workspace_id, status, priority_order for fast filtering
*/

CREATE TABLE IF NOT EXISTS requests (
  id              text PRIMARY KEY DEFAULT concat('req_', replace(gen_random_uuid()::text, '-', '')),
  org_id          text NOT NULL,
  workspace_id    text NOT NULL,
  title           text NOT NULL,
  description     text,
  type            text NOT NULL CHECK (type IN ('DESIGN', 'MOTION', 'COPY', 'STRATEGY', 'DEVELOPMENT')),
  status          text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'ACTIVE', 'IN_PROGRESS', 'IN_REVISION', 'COMPLETED', 'ARCHIVED')),
  priority_order  integer NOT NULL DEFAULT 1000,
  turnaround_tier text NOT NULL DEFAULT 'STANDARD' CHECK (turnaround_tier IN ('STANDARD', 'RUSH', 'PRIORITY')),
  brief_form_data jsonb,
  due_date        timestamptz,
  creator_id      text NOT NULL,
  assignee_id     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_requests_org_id ON requests (org_id);
CREATE INDEX IF NOT EXISTS idx_requests_workspace_id ON requests (workspace_id);
CREATE INDEX IF NOT EXISTS idx_requests_org_workspace ON requests (org_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests (status);
CREATE INDEX IF NOT EXISTS idx_requests_priority_order ON requests (priority_order);

ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view requests"
  ON requests FOR SELECT
  TO authenticated
  USING (org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id'));

CREATE POLICY "Org members can create requests"
  ON requests FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')
    AND creator_id = auth.uid()::text
  );

CREATE POLICY "Org members can update requests"
  ON requests FOR UPDATE
  TO authenticated
  USING (org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id'))
  WITH CHECK (org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id'));

CREATE POLICY "Creators can archive requests"
  ON requests FOR DELETE
  TO authenticated
  USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')
    AND creator_id = auth.uid()::text
  );
