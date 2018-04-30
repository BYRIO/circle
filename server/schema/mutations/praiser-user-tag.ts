import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from "graphql";
import { UserType, UserProfileTagType } from "../types/user";
import { UserInput } from "../types/user-input";
export const PraiserUserTag: GraphQLFieldConfig<{}, {}> = {
  type: new GraphQLList(UserProfileTagType),
  args: {
    userId:{ type: new GraphQLNonNull(GraphQLID) },
    label: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (obj, { user }) => {}
};
