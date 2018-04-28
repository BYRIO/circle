import {GraphQLObjectType, GraphQLString, GraphQLList,GraphQLID} from 'graphql';
import {ProfileLinkType} from './profile-link';
import {UserProfileType} from './user-profile';


export const ZoneType = new GraphQLObjectType({
    name:"Zone",
    description:"a zone",
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        abstract:{type:GraphQLString},
        description:{type:GraphQLString},
        avatar:{type:GraphQLString},
        created:{type:GraphQLString},
        updated:{type:GraphQLString},
        members:{type:new GraphQLList(UserProfileType)},
        links:{type:new GraphQLList(ProfileLinkType)},
        related:{type:new GraphQLList(ZoneType)}
    })
});