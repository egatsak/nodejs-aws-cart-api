import { Request } from 'express';
import { User } from 'src/users/models/models';

export interface AppRequest extends Request {
  user?: User;
}
