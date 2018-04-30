import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from "graphql";
import { UserType, UserProfileTagType } from "../types/user";
import { UserInput } from "../types/user-input";
export const DeleteUserTag: GraphQLFieldConfig<{}, {}> = {
  type: new GraphQLList(UserProfileTagType),
  args: {
    label: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (obj, { user }) => {}
};
