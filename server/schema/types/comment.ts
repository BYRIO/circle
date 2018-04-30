import {GraphQLObjectType, GraphQLString, GraphQLList,GraphQLID} from 'graphql';
import {ProfileLinkType} from './profile-link';
import {ZoneType} from './zone';

export const CommentType = new GraphQLObjectType({
    name:"UserProfileTag",
    description:"a user profile tag",
    fields:{
        label:{type:GraphQLString},
        color:{type:GraphQLString},
        creator:{type:GraphQLString},
        praisers:{type:new GraphQLList(GraphQLString)}
    }
});

export const UserProfileType = new GraphQLObjectType({
    name:"UserProfile",
    description:"a user profile",
    fields:{
        bio:{type:GraphQLString},
        tags:{type:new GraphQLList(UserProfileTagType)},
        links:{type:new GraphQLList(ProfileLinkType)},
    }
});

export const UserType = new GraphQLObjectType({
    name:"User",
    description:"a user profile",
    fields:{
        id:{type:GraphQLID},
        username:{type:GraphQLString},
        nickname:{type:GraphQLString},
        email:{type:GraphQLString},
        avatar:{type:GraphQLString},
        created:{type:GraphQLString},
        updated:{type:GraphQLString},
        profile:{type:UserProfileType},
        zones:{type:new GraphQLList(ZoneType)}
    }
});