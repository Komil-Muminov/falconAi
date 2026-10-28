import dotenv from 'dotenv';
import path from 'node:path';

const rootEnvPath = path.resolve(process.cwd(), '../.env');
dotenv.config({ path: rootEnvPath });

export const envConfig = {
  port: Number(process.env.PORT) || 5000,
  databasePath: process.env.DATABASE_PATH || './data/timetracker.sqlite'
};
