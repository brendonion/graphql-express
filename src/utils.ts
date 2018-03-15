import * as jwt from 'jsonwebtoken';
import { Prisma } from './generated/prisma';

export function getUserId(context): string {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token: string = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error('Not authenticated');
}

export interface Context {
  db: Prisma
  request: any
}

export const APP_SECRET = 'GraphQL-is-aw3some';
