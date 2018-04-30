import {
  GraphQLObjectType,
  GraphQLField,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLFieldConfig
} from "graphql";
import { UserType } from "../types/user";
import { userResolver } from "../resolvers/user";

export const UserQuery: GraphQLFieldConfig<{}, {}> = {
  type: new GraphQLList(UserType),
  description: "",
  args: {
    id: {
      type: GraphQLID
    },

    username: {
      type: GraphQLString
    },

    email: {
      type: GraphQLString
    }
  },
  resolve: userResolver
};
