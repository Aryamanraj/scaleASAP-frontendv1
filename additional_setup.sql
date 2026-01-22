-- Create onboarding_data table to store the complex form data
create table if not exists onboarding_data (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(workspace_id) -- One onboarding record per workspace
);

-- Enable RLS
alter table onboarding_data enable row level security;

-- Policies
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

-- Trigger to update updated_at
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
