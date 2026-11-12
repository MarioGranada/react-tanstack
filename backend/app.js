import express from 'express';

import cronRoutes from './routes/cron.js';
import { images } from './data/images.js';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from './data/events.js';

const app = express();
app.use(express.json());

// Deliberate delays let the frontend show TanStack Query loading states.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const IMAGE_PATHS = new Set(images.map((image) => image.path));
const isText = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

function isValidEvent(event) {
  return (
    isText(event.title, 200) &&
    isText(event.description, 2000) &&
    isText(event.date, 30) &&
    isText(event.time, 20) &&
    isText(event.location, 300) &&
    IMAGE_PATHS.has(event.image)
  );
}

// Everything lives under /api: on Vercel the SPA and the API share one origin,
// and in development Vite proxies /api to this server.
const api = express.Router();

api.get('/events', async (req, res) => {
  const { max, search } = req.query;
  const events = await listEvents({
    search: typeof search === 'string' && search.length <= 200 ? search : null,
    max,
  });
  res.json({ events });
});

api.get('/events/images', (req, res) => {
  res.json({ images });
});

api.get('/events/:id', async (req, res) => {
  const event = await getEvent(req.params.id);
  if (!event) {
    return res.status(404).json({ message: `For the id ${req.params.id}, no event could be found.` });
  }
  await delay(1000);
  res.json({ event });
});

api.post('/events', async (req, res) => {
  const { event } = req.body;
  if (!event) {
    return res.status(400).json({ message: 'Event is required' });
  }
  if (!isValidEvent(event)) {
    return res.status(400).json({ message: 'Invalid data provided.' });
  }
  const newEvent = await createEvent(event);
  res.json({ event: newEvent });
});

api.put('/events/:id', async (req, res) => {
  const { event } = req.body;
  if (!event) {
    return res.status(400).json({ message: 'Event is required' });
  }
  if (!isValidEvent(event)) {
    return res.status(400).json({ message: 'Invalid data provided.' });
  }
  const updated = await updateEvent(req.params.id, event);
  if (!updated) {
    return res.status(404).json({ message: 'Event not found' });
  }
  await delay(1000);
  res.json({ event: updated });
});

api.delete('/events/:id', async (req, res) => {
  const deleted = await deleteEvent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Event not found' });
  }
  await delay(1000);
  res.json({ message: 'Event deleted' });
});

api.use('/cron', cronRoutes);
api.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use('/api', api);

// Express 5 forwards rejected promises from async handlers here.
// Never send database errors to the browser.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong.' });
});

export default app;
