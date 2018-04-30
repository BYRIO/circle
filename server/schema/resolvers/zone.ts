import { knex } from "../../db";
export async function zoneResolver (root, { id },context,info) {
    return await knex("zones").where("id",id);
}
