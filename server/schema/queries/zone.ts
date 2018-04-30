import {
    GraphQLObjectType,
    GraphQLField,
    GraphQLList,
    GraphQLID,
    GraphQLString,
    GraphQLFieldConfig
  } from "graphql";
  import { ZoneType } from "../types/zone";
  import { zoneResolver } from "../resolvers/zone";
  
  export const UserProfileQuery: GraphQLFieldConfig<{}, {}> = {
    type: new GraphQLList(ZoneType),
    description: "",
    args: {
      id: {
        type: GraphQLID
      },
  
    },
    resolve: zoneResolver
  };
  