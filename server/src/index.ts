import { createApp } from './app.js';
import { envConfig } from './shared/config/env.js';
import { initDatabase } from './shared/db/connection.js';
import { seedMockDataIfEmpty } from './shared/db/seed.js';

initDatabase();
seedMockDataIfEmpty();

const app = createApp();

app.listen(envConfig.port, () => {
  console.log(`Server is running on http://localhost:${envConfig.port}`);
});
