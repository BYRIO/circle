import { GraphQLInputObjectType, GraphQLString } from "graphql";
import { isLength } from "validator";
import { IsUrl } from "class-validator";

export const ZoneProfileInput = new GraphQLInputObjectType({
  name: "ZoneProfileInput",
  fields: {
    name: {
      type: GraphQLString,
      vadation: {
        groups: ["create", "modify"],
        validator: _ => isLength(_, 1, 40)
      }
    },
    abstract: {
      type: GraphQLString,
      vadation: {
        groups: ["create", "modify"],
        validator: _ => isLength(_, 1, 250)
      }
    },
    description: {
      type: GraphQLString,
      vadation: {
        groups: ["create", "modify"],
        validator: _ => isLength(_, 1, 500)
      }
    },
    avatar: {
      type: GraphQLString,
      vadation: { groups: ["modify", "create"], validator: _ => IsUrl(_) }
    }
  }
});
