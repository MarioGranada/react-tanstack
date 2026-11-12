// Schema + seed SQL, kept in JS so the Vercel function bundle always includes it
// (no runtime file reads). Both statements are idempotent.

// Idempotent schema + seed. Safe to run repeatedly.
export const migration = `
create schema if not exists react_tanstack;

create table if not exists react_tanstack.events (
  id          text primary key default gen_random_uuid()::text,
  title       text not null,
  description text not null,
  date        text not null,
  time        text not null,
  location    text not null,
  image       text not null,
  created_at  timestamptz not null default now()
);

-- Only the server (postgres role) talks to this schema; keep the Data API out.
alter table react_tanstack.events enable row level security;

insert into react_tanstack.events (id, title, description, date, time, location, image, created_at) values
  ('e1', 'Web Dev Networking Night',
   'Meet, connect, and network with fellow budding web developers. Share your experiences and learn from others.',
   '2027-09-25', '18:00', 'Innovation Lounge, New York, NY', 'meeting-networking.jpg', '2026-01-01T10:00:00Z'),
  ('e2', 'City Hunt: Web Dev Edition',
   'Explore the city and discover hidden gems while completing fun web development challenges.',
   '2027-10-07', '10:00', 'Tech Training Academy, Los Angeles, CA', 'buzzing-city.jpg', '2026-01-02T10:00:00Z'),
  ('e3', 'Women in Web Development Mixer!',
   'An empowering event dedicated to women who are passionate about web development. Connect, share, and inspire.',
   '2027-05-21', '16:30', 'Empowerment Hall, Seattle, WA', 'women-coding.jpg', '2026-01-03T10:00:00Z')
on conflict (id) do nothing;
`;

// Empties the demo tables; running \`migration\` afterwards restores the seed.
export const reset = `
truncate react_tanstack.events;
`;
