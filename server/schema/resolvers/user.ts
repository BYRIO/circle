import { knex } from "../../db";
export async function userResolver (root, { id, username, email },context,info) {
    console.log(context);
    root.me();
    
    let user = null;
    if(id){
        user = await knex("real_users").where("id", id);
    }else if(username){
        user = await knex("real_users").where("username", username);
    }else if(email){
        user = await knex("real_users").where("email", email);
    }
    if(!user) return null;
    user.zones = knex("zones").whereRaw("array[?::uuid] @> members",user.id);
    user.ownedZones = knex("zones").where("owner",user.id);
    return user;
}
