// Local development server. On Vercel, the "backend" service serves app.js.
import app from './app.js';

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}/api`));
