import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from "graphql";
import { UserType } from "../types/user";
import { UserInput } from "../types/user-input";
import { ZoneType } from "../types/zone";
import { ZoneProfileInput } from "../types/zone-profile-input";
import { UserProfileInput } from "../types/user-profile-input";
export const ModifyUserProfile: GraphQLFieldConfig<{}, {}> = {
  type: UserType,
  args: {
    profile: { type: new GraphQLNonNull(UserProfileInput) }
  },
  resolve: async (obj, { user }) => {}
};
