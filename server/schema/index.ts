import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { UserProfileType, UserProfileTagType } from "./types/user";
import { ProfileLinkType } from "./types/profile-link";
import { ZoneType } from "./types/zone";
import { UserQuery } from "./queries/user";
import { AddTagToUser } from "./mutations/add-tag-to-user";
import { CreateZone } from "./mutations/create-zone";

export const Schema = new GraphQLSchema({
    types:[
        UserProfileType,
        UserProfileTagType,
        ProfileLinkType,
        ZoneType
    ],mutation:new GraphQLObjectType({
        name:"Mutation",
        fields:{
            addTagToUser:AddTagToUser,
            createZone:CreateZone
        }
    }),
    query: new GraphQLObjectType({
        name:"Query",
        fields:{
            user:UserQuery
        }
    })
})