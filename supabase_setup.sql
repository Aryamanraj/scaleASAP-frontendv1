-- Create workspaces table
create table if not exists workspaces (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid, -- Link to auth.users, nullable for now if we want to support unauthenticated creation (though we shouldn't) - but let's make it linked to auth.uid() by default on insert?
  -- Actually, let's keep it simple.
  name text not null,
  website text,
  role text default 'Owner',
  onboarding_status text default 'incomplete'
);

-- Enable Row Level Security
alter table workspaces enable row level security;

-- Policy: Users can view their own workspaces
create policy "Users can view their own workspaces"
  on workspaces for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own workspaces
-- We ensure the user_id inserted matches their auth.uid()
create policy "Users can insert their own workspaces"
  on workspaces for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own workspaces
create policy "Users can update their own workspaces"
  on workspaces for update
  using (auth.uid() = user_id);

-- Policy: Users can delete their own workspaces
create policy "Users can delete their own workspaces"
  on workspaces for delete
  using (auth.uid() = user_id);

-- Verify table creation
comment on table workspaces is 'Workspaces for ScaleMVP users';

-- Create onboarding_data table
create table if not exists onboarding_data (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(workspace_id)
);

-- Enable Row Level Security
alter table onboarding_data enable row level security;

-- Policy: Users can view their own onboarding data
create policy "Users can view their own onboarding data"
  on onboarding_data for select
  using (
    exists (
      select 1 from workspaces w
      where w.id = onboarding_data.workspace_id
      and w.user_id = auth.uid()
    )
  );

-- Policy: Users can insert their own onboarding data
create policy "Users can insert their own onboarding data"
  on onboarding_data for insert
  with check (
    exists (
      select 1 from workspaces w
      where w.id = onboarding_data.workspace_id
      and w.user_id = auth.uid()
    )
  );

-- Policy: Users can update their own onboarding data
create policy "Users can update their own onboarding data"
  on onboarding_data for update
  using (
    exists (
      select 1 from workspaces w
      where w.id = onboarding_data.workspace_id
      and w.user_id = auth.uid()
    )
  );

-- Verify table creation
comment on table onboarding_data is 'JSONB storage for onboarding responses linked to workspaces';
