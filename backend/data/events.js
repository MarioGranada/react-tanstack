import { sql } from '../db/index.js';

const SUMMARY = ['id', 'title', 'image', 'date', 'location'];

// Oldest first, like the original JSON file; `max` keeps the newest N.
export async function listEvents({ search, max }) {
  const term = search ? search.toLowerCase() : null;
  const limit = max ? Number.parseInt(max, 10) : null;
  return sql`
    select ${sql(SUMMARY)} from (
      select * from react_tanstack.events
      where ${term}::text is null
         or position(${term}::text in lower(title || ' ' || description || ' ' || location)) > 0
      order by created_at desc
      limit ${limit && limit > 0 ? limit : null}
    ) newest
    order by created_at asc`;
}

export async function getEvent(id) {
  const [event] = await sql`
    select id, title, description, date, time, location, image
    from react_tanstack.events where id = ${id}`;
  return event;
}

export async function createEvent({ title, description, date, time, location, image }) {
  const [event] = await sql`
    insert into react_tanstack.events (title, description, date, time, location, image)
    values (${title}, ${description}, ${date}, ${time}, ${location}, ${image})
    returning id, title, description, date, time, location, image`;
  return event;
}

export async function updateEvent(id, { title, description, date, time, location, image }) {
  const [event] = await sql`
    update react_tanstack.events
    set title = ${title}, description = ${description}, date = ${date},
        time = ${time}, location = ${location}, image = ${image}
    where id = ${id}
    returning id, title, description, date, time, location, image`;
  return event;
}

export async function deleteEvent(id) {
  const rows = await sql`delete from react_tanstack.events where id = ${id} returning id`;
  return rows.length > 0;
}
