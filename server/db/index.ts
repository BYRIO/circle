import { Pool } from "pg";
import * as Knex from "knex";
//#TODO: 全部换成knex
const pool = new Pool({
  connectionString: process.env.PG_URL,
});
export const Query = (text, params) => pool.query(text, params);
export const knex = Knex({
  client:'pg',
  connection:process.env.PG_URL
});