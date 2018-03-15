export const newLink = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.link(
      { },
      info,
    );
  },
}

export const newVote = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.vote(
      { },
      info,
    );
  },
}
