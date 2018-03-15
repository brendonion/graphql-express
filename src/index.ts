import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from './generated/prisma';
import { Context } from './utils';
import * as Query from './resolvers/Query';
import * as Mutation from './resolvers/Mutation';
import * as Subscription from './resolvers/Subscription';

const resolvers = {
  Query,
  Mutation,
  Subscription,
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req) => ({
    ...req,
    db: new Prisma({
      endpoint: 'http://localhost:4466/graphql-express/dev', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true, // log all GraphQL queries & mutations
    }),
  }),
});

server.start(() => console.log('Server is running on http://localhost:4000'));
