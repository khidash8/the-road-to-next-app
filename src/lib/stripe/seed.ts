import 'dotenv/config';
import { features } from 'process';
import { metadata } from '@/app/layout';
import { prisma } from '../prisma';
import { stripe } from './';

const seed = async () => {
  const t0 = performance.now();
  console.log('Seed: Started ...');

  // clean up

  const prices = await stripe.prices.list();
  const products = await stripe.products.list();
  const customers = await stripe.customers.list();

  for (const price of prices.data) {
    await stripe.prices.update(price.id, {
      active: false,
    });
  }

  for (const product of products.data) {
    await stripe.products.update(product.id, {
      active: false,
    });
  }

  for (const customer of customers.data) {
    await stripe.customers.del(customer.id);
  }

  // seed

  const organization = await prisma.organization.findFirstOrThrow();

  const customer = await stripe.customers.create({
    name: 'admin',
    email: 'admin@admin.com',
  });

  await prisma.stripeCustomer.create({
    data: {
      customerId: customer.id,
      organizationId: organization.id,
    },
  });

  const productOne = await stripe.products.create({
    name: 'Business Plan',
    description: 'Your business plan.',
    metadata: {
      allowedMembers: 999,
    },
    features: [
      {
        name: 'Cancel anytime',
      },
      {
        name: 'Unlimited members',
      },
    ],
  });

  const productTwo = await stripe.products.create({
    name: 'Startup Plan',
    description: 'Your startup plan.',
    metadata: {
      allowedMembers: 3,
    },
    features: [
      {
        name: 'Cancel anytime',
      },
      {
        name: 'Up to 3 members',
      },
    ],
  });

  await stripe.prices.create({
    product: productTwo.id,
    unit_amount: 19999,
    currency: 'usd',
    recurring: {
      interval: 'year',
    },
  });

  await stripe.prices.create({
    product: productTwo.id,
    unit_amount: 1999,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
  });

  await stripe.prices.create({
    product: productOne.id,
    unit_amount: 39999,
    currency: 'usd',
    recurring: {
      interval: 'year',
    },
  });

  await stripe.prices.create({
    product: productOne.id,
    unit_amount: 3999,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
  });

  const t1 = performance.now();
  console.log(`Seed: Finished (${t1 - t0}ms)`);
};

seed();
