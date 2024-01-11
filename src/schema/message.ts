import { IMessage } from '@gateway/interface/message';
import Joi from 'joi';


export const messageSchema = Joi.object({
  name: Joi
    .string()
    .required(),
  age: Joi
    .number()
    .required()
    .allow(null),
  content: Joi
    .string()
    .required(),
    
}) as Joi.ObjectSchema<IMessage>;