import {GraphQLObjectType, GraphQLString, GraphQLList} from 'graphql';

export const ProfileLinkType = new GraphQLObjectType({
    name:"ProfileLink",
    description:"a profile link",
    fields:{
        label:{type:GraphQLString},
        url:{type:GraphQLString},
    }
});