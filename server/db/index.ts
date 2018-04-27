import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.PG_URL,
});
export const Query = (text, params) => pool.query(text, params);
