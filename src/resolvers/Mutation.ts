import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Mutation } from '../generated/prisma';
import { APP_SECRET, getUserId } from '../utils';

export function post(parent, { url, description }, context, info): Mutation {
  const userId: string = getUserId(context);
  return context.db.mutation.createLink(
    { data: { url, description, postedBy: { connect: { id: userId } } } }, 
    info
  );
}

export async function signup(parent, args, context, info): Promise<AuthResponse> {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

export async function login(parent, args, context, info): Promise<AuthResponse> {
  const user = await context.db.query.user({ where: { email: args.email } });
  if (!user) {
    throw new Error(`Could not find user with email: ${args.email}`);
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

export async function vote(parent, args, context, info): Promise<Mutation> {
  const userId = getUserId(context);
  const { linkId } = args;
  const linkExists = await context.db.exists.Vote({
    user: { id: userId },
    link: { id: linkId },
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${linkId}`);
  }

  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: linkId } },
      },
    },
    info,
  );
}

// TODO -> Put in separate custom types file
type AuthResponse = {
  token: string,
  user: any,
}
