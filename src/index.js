import { GraphQLServer } from 'graphql-yoga';
import { startDB, models } from './db';
import { resolvers, pubsub} from './graphql/resolvers';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import DataLoader from "dataloader";
import _ from "lodash";

const axios = require("axios");
const depthLimit = require('graphql-depth-limit');

const uri_api = {"uri": "http://localhost:3000"}

const db = startDB({ 
  user: 'graphql', 
  pwd: '12qwaszx', 
  db: 'graphql', 
  url: 'ds139446.mlab.com:39446' 
})

const mensagens = async (keys, { Post }) =>{    
  const msg = await Post.find({ user_id: { $in:keys } });
  const gb = _.groupBy(msg, 'user_id')

  return keys.map(k => gb[k] || []) ;
}

const context = {
  pubsub,
  models,
  db,
  axios,
  uri_api,
  mensagensLoader: new DataLoader(keys => mensagens(keys, models) )
};

const options = {    
  port: 4000,
  deduplicator: true,
  endpoint: '/graphql',     
  playground: '/playground',     
  subscriptions: '/subscriptions',
  validationRules:[depthLimit(3)],
}

const server = new GraphQLServer({
  typeDefs: `${__dirname}/graphql/schema.graphql`,  
  resolvers,
  context,
});

server.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

server.start(options, ({port}) => { 
  console.log(` "\ {^_^}/ My GraphQL is running on http://localhost:${port}`);
});