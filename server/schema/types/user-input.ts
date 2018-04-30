import { GraphQLInputObjectType, GraphQLString } from "graphql";
import { isLength } from "validator";
import { IsUrl } from "class-validator";
export const UserInput = new GraphQLInputObjectType({
  name: "user input",
  fields: {
    nickname: {
      type: GraphQLString,
      vadation: { groups: ["modify"], validator: _ => isLength(_, 1, 40) }
    },
    avatar: {
      type: GraphQLString,
      vadation: { groups: ["modify"], validator: _ => IsUrl(_) }
    }
  }
});
