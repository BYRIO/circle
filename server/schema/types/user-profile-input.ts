import { GraphQLInputObjectType, GraphQLString } from "graphql";
import { isLength } from "validator";
import { IsUrl } from "class-validator";
export const UserProfileInput = new GraphQLInputObjectType({
  name: "user profile input",
  fields: {
    bio: {
      type: GraphQLString,
    }
  }
});
