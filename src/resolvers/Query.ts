import { Query } from '../generated/prisma';

export function feed(parent, args, context, info): Query {
  const { filter, first, skip } = args; // destructure input arguments
  const where = filter
    ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
    : {};

  return context.db.query.links({ first, skip, where }, info);
}
