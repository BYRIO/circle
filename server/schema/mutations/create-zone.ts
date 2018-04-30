import {
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList
} from "graphql";
import { values } from "lodash";
import { UserType, UserProfileTagType } from "../types/user";
import { UserInput } from "../types/user-input";
import { ProfileLinkType } from "../types/profile-link";
import { ZoneProfileInput } from "../types/zone-profile-input";
import { ZoneProfileType, ZoneType } from "../types/zone";
import { mGraphQLFieldConfig } from "../mIGraphQLFieldConfig";
import { knex } from "../../db";
export const CreateZone: mGraphQLFieldConfig = {
  type: ZoneType,
  args: {
    profile: { type: new GraphQLNonNull(ZoneProfileInput) }
  },
  resolve: async (root, { profile }) => {
    const me = root.me();
    let result =  await knex("zones").insert({
      owner: me,
      profile: Object.assign({
        links: {}
      },profile),
      members: [me]
    }).returning(`*`);
    result[0].profile.links = ()=>{console.log(32435);return values(result[0].profile.links); };
    return result[0];
  }
};
