import { useAuth } from 'wasp/client/auth';
import { stripePayment } from 'wasp/client/operations';
import { TierIds, STRIPE_CUSTOMER_PORTAL_LINK } from '../../shared/constants';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { cn } from '../../shared/utils';

export const tiers = [
  // {
  //   name: 'Hobby',
  //   id: TierIds.HOBBY,
  //   price: '$9.99',
  //   description: 'All you need to get started',
  //   features: ['Limited monthly usage', 'Basic support'],
  // },
  {
    name: 'Pro',
    id: TierIds.PRO,
    price: '$19.99',
    description: 'Our most popular plan',
    features: ['Unlimited monthly usage', 'Priority customer support'],
    bestDeal: true,
  },
  // {
  //   name: '10 Credits',
  //   id: TierIds.CREDITS,
  //   price: '$9.99',
  //   description: 'One-time purchase of 10 credits for your account',
  //   features: ['Use credits for e.g. OpenAI API calls', 'No expiration date'],
  // },
];

const PricingPage = () => {
  const [isStripePaymentLoading, setIsStripePaymentLoading] = useState<boolean | string>(false);

  const { data: user, isLoading: isUserLoading } = useAuth();

  const history = useHistory();

  async function handleBuyNowClick(tierId: string) {
    if (!user) {
      history.push('/login');
      return;
    }
    try {
      setIsStripePaymentLoading(tierId);
      let stripeResults = await stripePayment(tierId);

      if (stripeResults?.sessionUrl) {
        window.open(stripeResults.sessionUrl, '_self');
      }
    } catch (error: any) {
      console.error(error?.message ?? 'Something went wrong.');
    } finally {
      setIsStripePaymentLoading(false);
    }
  }

  return (
    <div className='py-10 lg:mt-10'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div id='pricing' className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-4xl font-bold tracking-tight text-airt-font-base sm:text-5xl dark:text-white'>
            Pick your <span className='text-airt-primary'>pricing</span>
          </h2>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-airt-font-base dark:text-white'>
          Stripe subscriptions and secure webhooks are built-in. Just add your Stripe Product IDs! Try it out below with
          test credit card number{' '}
          <span className='px-2 py-1 bg-airt-primary rounded-md text-airt-font-base'>4242 4242 4242 4242 4242</span>
        </p>
        <div className='justify-center isolate mx-auto mt-16 max-w-none gap-y-8 lg:gap-x-8 sm:mt-20 lg:mx-0 lg:max-w-none'>
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative flex flex-col  ring-2 mx-auto grow justify-center max-w-md rounded-3xl ring-gray-200 overflow-hidden p-8 xl:p-10',
                {
                  'ring-2': tier.bestDeal,
                  'ring-1 lg:mt-8': !tier.bestDeal,
                }
              )}
            >
              {tier.bestDeal && (
                <div className='absolute top-0 right-0 -z-10 w-full h-full ' aria-hidden='true'>
                  <div className='absolute w-full h-full bg-airt-primary' />
                </div>
              )}
              <div className='mb-8'>
                <div className='flex items-center justify-between gap-x-4'>
                  <h3 id={tier.id} className='text-airt-font-base text-lg font-semibold leading-8 dark:text-white'>
                    {tier.name}
                  </h3>
                </div>
                <p className='mt-4 text-sm leading-6 text-airt-font-base dark:text-white'>{tier.description}</p>
                <p className='mt-6 flex items-baseline gap-x-1 dark:text-white'>
                  <span className='text-4xl font-bold tracking-tight text-airt-font-base dark:text-white'>
                    {tier.price}
                  </span>
                  <span className='text-sm font-semibold leading-6 text-airt-font-base dark:text-white'>
                    {tier.id !== TierIds.CREDITS && '/month'}
                  </span>
                </p>
                <ul role='list' className='mt-8 space-y-3 text-sm leading-6 text-airt-font-base dark:text-white'>
                  {tier.features.map((feature) => (
                    <li key={feature} className='flex gap-x-3'>
                      <AiFillCheckCircle
                        className={cn('h-6 w-5 flex-none ', {
                          'text-airt-font-base': tier.bestDeal,
                          'text-airt-primary': !tier.bestDeal,
                        })}
                        aria-hidden='true'
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {!!user && user.hasPaid ? (
                <a
                  href={STRIPE_CUSTOMER_PORTAL_LINK}
                  aria-describedby='manage-subscription'
                  className={cn(
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-airt-primary',
                    {
                      'bg-airt-primary text-white hover:text-white shadow-sm hover:bg-airt-primary': tier.bestDeal,
                      'text-airt-font-base ring-1 ring-inset ring-purple-200 hover:ring-purple-400': !tier.bestDeal,
                    }
                  )}
                >
                  Manage Subscription
                </a>
              ) : (
                <button
                  onClick={() => handleBuyNowClick(tier.id)}
                  aria-describedby={tier.id}
                  className={cn(
                    {
                      'bg-airt-secondary text-white hover:text-airt-primary shadow-sm hover:bg-airt-font-base':
                        tier.bestDeal,
                      'text-airt-font-base  ring-1 ring-inset ring-purple-200 hover:ring-purple-400': !tier.bestDeal,
                    },
                    {
                      'cursor-wait': isStripePaymentLoading === tier.id,
                    },
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm dark:text-white font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-airt-primary'
                  )}
                >
                  {!!user ? 'Buy plan' : 'Log in to buy plan'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
