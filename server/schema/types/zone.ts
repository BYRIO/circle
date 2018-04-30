import {GraphQLObjectType, GraphQLString, GraphQLList,GraphQLID} from 'graphql';
import {ProfileLinkType} from './profile-link';
import {UserProfileType} from './user';

export const ZoneProfileType = new GraphQLObjectType({
    name:"ZoneProfile",
    description:"a zone profile",
    fields:()=>({
        name:{type:GraphQLString},
        abstract:{type:GraphQLString},
        description:{type:GraphQLString},
        avatar:{type:GraphQLString},
        links:{type:new GraphQLList(ProfileLinkType)},
        related:{type:new GraphQLList(ZoneType)}
    })
});
export const ZoneType = new GraphQLObjectType({
    name:"Zone",
    description:"a zone",
    fields:()=>({
        id:{type:GraphQLID},
        owner:{type:UserProfileType},
        members:{type:new GraphQLList(UserProfileType)},
        profile:{type:ZoneProfileType},
        created:{type:GraphQLString},
        updated:{type:GraphQLString}
    })
});