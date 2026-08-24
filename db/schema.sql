-- Quote submissions.
--
-- Run once against Vercel Postgres, Supabase, Neon or any Postgres, then set
-- QUOTE_DATABASE_URL (or POSTGRES_URL / DATABASE_URL) in the environment.
--
-- The point of this table is that a lead survives the email provider having a
-- bad afternoon. app/quote/actions.ts writes here BEFORE it tries to send.

create table if not exists quote_submissions (
  id            bigserial primary key,
  reference     text        not null unique,
  needs         text[]      not null default '{}',
  package_slug  text,
  answers       jsonb       not null default '{}'::jsonb,
  deadline      text,
  budget        text,
  contact_name  text        not null,
  business      text,
  email         text        not null,
  phone         text,
  city          text,
  notes         text,
  attachment    jsonb,
  source        text,
  submitted_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- The two lookups anyone actually performs: by reference off a customer
-- email, and "what came in this week".
create index if not exists quote_submissions_reference_idx  on quote_submissions (reference);
create index if not exists quote_submissions_submitted_idx  on quote_submissions (submitted_at desc);
create index if not exists quote_submissions_email_idx      on quote_submissions (lower(email));
