-- 1. Create workspaces table first (Parent table)
create table if not exists workspaces (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid, -- Link to auth.uid()
  name text not null,
  website text,
  role text default 'Owner',
  onboarding_status text default 'incomplete'
);

-- Enable RLS for workspaces
alter table workspaces enable row level security;

-- Policies for workspaces
create policy "Users can view their own workspaces"
  on workspaces for select
  using (auth.uid() = user_id);

create policy "Users can insert their own workspaces"
  on workspaces for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workspaces"
  on workspaces for update
  using (auth.uid() = user_id);

create policy "Users can delete their own workspaces"
  on workspaces for delete
  using (auth.uid() = user_id);


-- 2. Create onboarding_data table (Child table) with granular columns
-- We drop it first if it exists to ensure the schema update is applied (WARNING: DATA LOSS if running in prod on existing table)
-- Since this is setup, we assume dev mode.
drop table if exists onboarding_data;

create table onboarding_data (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Section 1: The Founding Story
  trigger_moment text,
  founder_role text,
  team_size text,
  stage text,
  funding_type text[],
  funding_amount text,
  funding_date text,
  runway text,

  -- Section 2: Company Foundations
  company_name text,
  website text,
  linkedin text,
  twitter text,
  company_type text, -- 'software' | 'services'
  one_sentence_pitch text,
  user_does text,
  product_does text,
  user_gets text,
  before_state text,
  after_state text,
  price text,
  sales_cycle text,
  decision_process text,
  decision_process_other text,

  -- Section 3: Customer Evidence
  has_paying_customers boolean,
  total_customers text,
  total_revenue text,
  monthly_recurring text,
  
  -- Complex nested structures kept as JSONB for sanity, or could normally be separate tables
  best_customers jsonb, -- Array of objects
  lost_customers jsonb, -- Object with fields

  -- Section 4: Worldview
  customer_metaphors text,
  customer_pride text,
  customer_frustration text,
  one_phrase_world text,

  -- Section 5: Voice DNA
  content_examples text,
  start_messages text,
  end_messages text,
  words_used text,
  words_never_used text,
  emoji_usage text,
  chaos_test text,
  chaos_test_other text,

  -- Section 6: GTM
  cold_email_stats jsonb,
  linkedin_stats jsonb,
  inbound_stats jsonb,
  other_channels text,
  
  list_size text,
  list_source text,
  list_quality text,
  list_last_touched text,

  -- Section 7: Success
  revenue_goal text,
  customer_goal text,
  key_metric text,
  timeline_pressure text,
  good_meeting_definition text,
  quit_conditions text[],
  quit_condition_other text,

  -- Services Specific
  core_offer text,
  delivery_process jsonb,
  deliverables text[],
  deliverables_other text,
  after_state_metrics jsonb,
  pricing_model text,
  pricing_details text,
  setup_fee text,
  contract_length text,
  time_to_results text,
  current_clients_count text,
  capacity_count text,
  delivery_bottleneck text,
  delivery_bottleneck_other text,

  unique(workspace_id)
);

-- Enable RLS for onboarding_data
alter table onboarding_data enable row level security;

-- Policies for onboarding_data (Relies on workspace ownership)
create policy "Users can view their own onboarding data via workspace"
  on onboarding_data for select
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = onboarding_data.workspace_id
      and workspaces.user_id = auth.uid()
    )
  );

create policy "Users can insert their own onboarding data via workspace"
  on onboarding_data for insert
  with check (
    exists (
      select 1 from workspaces
      where workspaces.id = onboarding_data.workspace_id
      and workspaces.user_id = auth.uid()
    )
  );

create policy "Users can update their own onboarding data via workspace"
  on onboarding_data for update
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = onboarding_data.workspace_id
      and workspaces.user_id = auth.uid()
    )
  );

create policy "Users can delete their own onboarding data via workspace"
  on onboarding_data for delete
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = onboarding_data.workspace_id
      and workspaces.user_id = auth.uid()
    )
  );

-- Trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_onboarding_data_updated_at
    before update on onboarding_data
    for each row
    execute function update_updated_at_column();
