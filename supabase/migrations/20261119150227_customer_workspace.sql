-- Customer settings extend the profile provisioned by the existing signup trigger.
alter table public.profiles
  add column display_name text check (char_length(display_name) between 1 and 60),
  add column account_class text check (account_class in ('Student','Professional','Other')),
  add column qualification text check (char_length(qualification) <= 100),
  add column study_year smallint check (study_year between 1 and 8),
  add column graduation_year smallint check (graduation_year between 1950 and 2150),
  add column technical_interests text check (char_length(technical_interests) <= 300),
  add column technology_interests text check (char_length(technology_interests) <= 300),
  add column project_domains text[] not null default '{}' check (
    array_position(project_domains, null) is null and cardinality(project_domains) <= 9 and
    project_domains <@ array['AI/ML','Web development','Mobile applications','IoT','Embedded systems','Electronics','Robotics','Automation','Digital design']::text[]),
  add column preferred_categories text[] not null default '{}' check (
    array_position(preferred_categories, null) is null and cardinality(preferred_categories) <= 6 and
    preferred_categories <@ array['software-development','artificial-intelligence-ml','iot-electronics','embedded-systems','robotics','simulation-design']::text[]),
  add column default_address_id uuid;

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  recipient text not null check (char_length(btrim(recipient)) between 2 and 80),
  phone text not null check (phone ~ '^[0-9]{10}$'),
  line1 text not null check (char_length(btrim(line1)) between 4 and 160),
  line2 text check (char_length(line2) <= 160),
  landmark text check (char_length(landmark) <= 120),
  city text not null check (char_length(btrim(city)) between 2 and 80),
  region text not null check (char_length(btrim(region)) between 2 and 80),
  pin text not null check (pin ~ '^[1-9][0-9]{5}$'),
  country text not null default 'IN' check (country = 'IN'),
  created_at timestamptz not null default now(),
  unique (user_id, id)
);
alter table public.profiles add constraint profiles_own_default_address
  foreign key (id, default_address_id) references public.customer_addresses(user_id,id)
  on delete set null (default_address_id);

create table public.customer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 5 and 160),
  category text not null check (char_length(btrim(category)) between 1 and 100),
  specification jsonb not null check (
    jsonb_typeof(specification) = 'object' and octet_length(specification::text) <= 48000 and
    specification ?& array['requirements','expectedFunctionality','classification','deliverables'] and
    jsonb_typeof(specification->'requirements') = 'string' and char_length(btrim(specification->>'requirements')) >= 30 and
    jsonb_typeof(specification->'expectedFunctionality') = 'string' and char_length(btrim(specification->>'expectedFunctionality')) >= 15 and
    specification->>'classification' in ('software','hardware','hybrid') and
    jsonb_typeof(specification->'deliverables') = 'array' and jsonb_array_length(specification->'deliverables') > 0 and
    (specification - array['classification','requirements','expectedFunctionality','techStack','hardwareSpecs','academicContext','budgetRange','targetDeliveryDate','deliverables','referenceProjectSlug','requestKind']) = '{}'::jsonb),
  status text not null default 'submitted' check (status in ('submitted','feasibility_review','quotation_ready','in_development','completed','closed')),
  created_at timestamptz not null default now()
);
create index customer_requests_owner_date on public.customer_requests (user_id,created_at desc);

create table public.customer_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  topic text not null check (topic in ('Account','Order or project','Custom request','Account deletion','Other')),
  subject text not null check (char_length(btrim(subject)) between 3 and 120),
  body text not null check (char_length(btrim(body)) between 10 and 2000),
  status text not null default 'received' check (status in ('received','in_review','closed')),
  created_at timestamptz not null default now()
);
create index customer_tickets_owner_date on public.customer_tickets (user_id,created_at desc);
create table public.customer_support_replies (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.customer_tickets(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 8000),
  created_at timestamptz not null default now()
);
create index customer_replies_ticket_date on public.customer_support_replies (ticket_id,created_at desc);

alter table public.customer_addresses enable row level security;
alter table public.customer_requests enable row level security;
alter table public.customer_tickets enable row level security;
alter table public.customer_support_replies enable row level security;

create policy own_addresses on public.customer_addresses for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy read_own_requests on public.customer_requests for select to authenticated using (user_id = (select auth.uid()));
create policy submit_own_requests on public.customer_requests for insert to authenticated with check (user_id = (select auth.uid()));
create policy read_own_tickets on public.customer_tickets for select to authenticated using (user_id = (select auth.uid()));
create policy submit_own_tickets on public.customer_tickets for insert to authenticated with check (user_id = (select auth.uid()));
create policy read_own_replies on public.customer_support_replies for select to authenticated using (
  exists (select 1 from public.customer_tickets t where t.id = ticket_id and t.user_id = (select auth.uid()))
);

-- Remove platform default grants before granting specific customer operations.
revoke all on public.customer_addresses, public.customer_requests, public.customer_tickets, public.customer_support_replies from public, anon, authenticated;
grant select, delete on public.customer_addresses to authenticated;
grant insert(id,recipient,phone,line1,line2,landmark,city,region,pin), update(recipient,phone,line1,line2,landmark,city,region,pin) on public.customer_addresses to authenticated;
grant select on public.customer_requests, public.customer_tickets, public.customer_support_replies to authenticated;
grant insert(id,title,category,specification) on public.customer_requests to authenticated;
grant insert(id,topic,subject,body) on public.customer_tickets to authenticated;
grant all on public.customer_addresses, public.customer_requests, public.customer_tickets, public.customer_support_replies to service_role;

-- Identity and financial fields are outside the editable customer profile.
revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant update(full_name,display_name,phone_number,college_name,degree_branch,account_class,qualification,study_year,graduation_year,technical_interests,technology_interests,project_domains,preferred_categories,default_address_id) on public.profiles to authenticated;
grant select (id,user_id,status,total_paise,currency,created_at) on public.orders to authenticated;
grant select (id,order_id,project_id,package_name) on public.order_items to authenticated;
grant select (id,user_id,order_id,file_name,is_active) on public.deliverable_entitlements to authenticated;
grant select (id,title,slug) on public.projects to authenticated;
-- Read receipts are per customer, apply only to an owned ticket and never alter the staff reply.
create table public.customer_reply_reads (
 user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
 reply_id uuid not null references public.customer_support_replies(id) on delete cascade,
 primary key(user_id,reply_id)
);
create index customer_reply_reads_reply on public.customer_reply_reads(reply_id);
alter table public.customer_reply_reads enable row level security;
create policy read_own_receipts on public.customer_reply_reads for select to authenticated using(user_id=(select auth.uid()));
create policy mark_own_reply_read on public.customer_reply_reads for insert to authenticated with check (
 user_id=(select auth.uid()) and exists(select 1 from public.customer_support_replies r join public.customer_tickets t on t.id=r.ticket_id where r.id=reply_id and t.user_id=(select auth.uid()))
);
revoke all on public.customer_reply_reads from public,anon,authenticated;
grant select,insert(reply_id) on public.customer_reply_reads to authenticated;
grant all on public.customer_reply_reads to service_role;
