import {
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList
} from "graphql";
import { UserType, UserProfileTagType } from "../types/user";
import { UserInput } from "../types/user-input";
import { knex } from "../../db";
import { mGraphQLFieldConfig } from "../mIGraphQLFieldConfig";
import { values } from "lodash";
export const AddTagToUser: mGraphQLFieldConfig = {
  type: new GraphQLList(UserProfileTagType),
  args: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    label: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (root, { userId, label }) => {
    const sourceId = root.me();
    const targetId = userId;
    let originTags = null;
    try {
      originTags = await knex("real_users")
        .where("id", targetId)
        .select("profile->'tags'");
    } catch (err) {}
    if (originTags && originTags[label]) {
      throw "Tag exists.";
    } else {
      const tag = {
        label: label,
        creator: sourceId,
        praisers: []
      };
      if (!originTags) {
        let tags = {};
        tags[label] = tag;

        await knex("users")
          .update(
            "profile",
            knex.raw(`jsonb_set(profile,'{tags}',jsonb ?)`,JSON.stringify(tags))
          )
          .where("id", targetId);
        return [tag];
      } else {
        return values(
          await knex("users")
            .update(
              "profile",
              knex.raw(
                `jsonb_set(profile,'{tags,?}',?)`,
                label,
                JSON.stringify(tag)
              )
            )
            .where("id", targetId)
            .returning(`profile->tags`)
        );
      }
    }
  }
};
