import { type User } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type StripePayment, type UpdateCurrentUser, type UpdateUserById } from 'wasp/server/operations';
import Stripe from 'stripe';
import type { StripePaymentResult } from '../shared/types';
import { fetchStripeCustomer, createStripeCheckoutSession } from './payments/stripeUtils.js';
import { TierIds } from '../shared/constants.js';

export const stripePayment: StripePayment<string, StripePaymentResult> = async (tier, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const userEmail = context.user.email;
  if (!userEmail) {
    throw new HttpError(
      403,
      'User needs an email to make a payment. If using the usernameAndPassword Auth method, switch to an Auth method that provides an email.'
    );
  }

  let priceId;
  if (tier === TierIds.HOBBY) {
    priceId = process.env.HOBBY_SUBSCRIPTION_PRICE_ID!;
  } else if (tier === TierIds.PRO) {
    priceId = process.env.PRO_SUBSCRIPTION_PRICE_ID!;
  } else if (tier === TierIds.CREDITS) {
    priceId = process.env.CREDITS_PRICE_ID!;
  } else {
    throw new HttpError(404, 'Invalid tier');
  }

  let customer: Stripe.Customer;
  let session: Stripe.Checkout.Session;
  try {
    customer = await fetchStripeCustomer(userEmail);
    session = await createStripeCheckoutSession({
      priceId,
      customerId: customer.id,
      mode: tier === TierIds.CREDITS ? 'payment' : 'subscription',
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Internal server error';
    throw new HttpError(statusCode, errorMessage);
  }

  await context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      checkoutSessionId: session.id,
      stripeId: customer.id,
    },
  });

  return {
    sessionUrl: session.url,
    sessionId: session.id,
  };
};

export const updateUserById: UpdateUserById<{ id: number; data: Partial<User> }, User> = async (
  { id, data },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403);
  }

  const updatedUser = await context.entities.User.update({
    where: {
      id,
    },
    data,
  });

  return updatedUser;
};

export const updateCurrentUser: UpdateCurrentUser<Partial<User>, User> = async (user, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: user,
  });
};
