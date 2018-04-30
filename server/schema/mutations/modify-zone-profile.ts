import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from "graphql";
import { UserType } from "../types/user";
import { UserInput } from "../types/user-input";
import { ZoneType } from "../types/zone";
import { ZoneProfileInput } from "../types/zone-profile-input";
export const ModifyZoneProfile: GraphQLFieldConfig<{}, {}> = {
  type: ZoneType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    profile: { type: new GraphQLNonNull(ZoneProfileInput) }
  },
  resolve: async (obj, { user }) => {}
};
