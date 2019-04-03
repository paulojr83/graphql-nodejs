import { PubSub } from 'graphql-yoga';


export const pubsub = new PubSub();

const NEW_POST = 'NEW_POST';

const resolvers = {
  Employment :{
    friends: async (parent, args, { models }, info )=>{
      const friends = await models.Employment.find({ friend_id: parent.id});
      return friends ;
    }
  },
    Subscription: {
      newPost: {
        subscribe: () => pubsub.asyncIterator(NEW_POST),
      },
    },
    Company:{
      employment:  async (parent, args, { models }, info )=>{  
        return await models.Employment.find({ company_id: parent.id});
      }
    },
    Employment: {
      company: async (parent, args, {uri_api, axios}, info )=>{       
        return await axios
          .get(`${uri_api.uri}/companies/${parent.company_id}`)
          .then(resp => resp.data)
          .catch(err =>
          `Employment ${err.response.statusText}`
          );
      },
    },
    Query: {
      
      description: (parent, args, context, info) => 'Hello GraphQL',  
      
      posts: async (parent, args, { models }) => {                  
        return await models.Post.find({});   
      },
      
      employments: {
        description: 'Retorna lista de employments.',
        resolverOf: 'Employment.employment', 
        resolver: async (parent, args, { models }) => {
          const employment =await models.Employment.find();
          console.log("Aqui", employment)
          return employment;
        }
      },
      employment: async (parent, args, { models }) => {        
        return await models.Employment.findById({ _id:args._id });
      },
      companies: async (parent, args, {uri_api, axios}, info )=>{    
        return await axios
          .get(`${uri_api.uri}/companies`)
          .then(resp => resp.data)
          .catch(err =>
          `Employment ${err.response.statusText}`
          );
      },
    },
    Mutation: {
     
      createEmployment: async (parent, { name, email, company }, { models }) => {        
        const newEmployment = new models.Employment( { name, email, company_id: company.id } );              
        try {
          return await newEmployment.save();
        } catch (e) {
          throw new Error('Cannot Save Employment!!!');
        }
      },
      updateEmployment: async (parent, { _id, name, email, company }, { models }) => {
        try {
          return await models.Employment.findByIdAndUpdate( _id, {name , email, company_id: company.id});
        } catch (e) {
          throw new Error('Cannot update Employment!!!');
        }
      },
      removeEmployment: async (parent, { _id }, { models }) => {        
        const remove =  await models.Employment.findByIdAndRemove( { _id } );
              
        try {
          return remove === undefined ? false:true;
        } catch (e) {
          throw new Error('Cannot remove Employment!!!');
        }
      },
      createCompany:(parent, { name }, {uri_api, axios }, info)=>{        
        return axios
        .post(`${uri_api.uri}/companies/`, {name:name} )
        .then(resp => resp.data )
        .catch(err => `Message ${err.response.statusText}`);
      },
      createPost: async (parent, args, { models }) => {        
        const newPost = new models.Post( args.input);
              
        try {
          await newPost.save();
        } catch (e) {
          throw new Error('Cannot Save Post!!!');
        }
        
        pubsub.publish(NEW_POST, {
          newPost,
        });

        return newPost;
      },
    }
};

module.exports = {resolvers, pubsub}