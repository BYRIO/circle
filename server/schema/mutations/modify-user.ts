import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from "graphql";
import { UserType } from "../types/user";
import { UserInput } from "../types/user-input";
export const ModifyUserMutation: GraphQLFieldConfig<{}, {}> = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user: { type: new GraphQLNonNull(UserInput) }
  },
  resolve: async (obj, { user }) => {}
};
