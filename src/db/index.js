import mongoose from 'mongoose';
import Employment from './employment';
import Post from './post.js';


mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);

export const startDB = ({ user, pwd, url, db }) => mongoose.connect(
    `mongodb://${user}:${pwd}@${url}/${db}`, { useNewUrlParser: true } );
  
export const models = { Employment, Post, }