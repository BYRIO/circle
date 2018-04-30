import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from "graphql";
import { UserType, UserProfileTagType } from "../types/user";
import { UserInput } from "../types/user-input";
import { ProfileLinkType } from "../types/profile-link";
export const ModifyUserProfileLinks: GraphQLFieldConfig<{}, {}> = {
  type: new GraphQLList(ProfileLinkType),
  args: {
    links: { type: new GraphQLList(ProfileLinkType) }
  },
  resolve: async (obj, { user }) => {}
};
