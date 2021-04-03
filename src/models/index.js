// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Response, Message, Organization, User } = initSchema(schema);

export {
  Response,
  Message,
  Organization,
  User
};