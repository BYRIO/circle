import { GraphQLFieldConfig } from "graphql"
export type mGraphQLFieldConfig =  GraphQLFieldConfig<{
    me:()=>string
}, {}>;