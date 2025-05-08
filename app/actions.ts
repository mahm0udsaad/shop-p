'use server'

import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'
import { configureLemonSqueezy } from './config/lemonsqueezy'
import { createClient } from '@/lib/supabase/server'

export async function getCheckoutURL(variantId: number, embed = false) {
  try {
    configureLemonSqueezy()

    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error('User is not authenticated.')
    }

    const checkout = await createCheckout(
      178354, // your store ID
  793602, // this variant ID
      {
        checkoutOptions: {
          embed,
          media: false,
          logo: !embed,
        },
        checkoutData: {
          email: session.user.email ?? undefined,
          custom: {
            user_id: session.user.id,
          },
        },
        productOptions: {
          enabledVariants: [variantId],
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          receiptButtonText: 'Go to Dashboard',
          receiptThankYouNote: 'Thank you for subscribing to our service!',
        },
      }
    )

    if (!checkout?.data?.data?.attributes?.url) {
      console.error('Invalid checkout response:', checkout)
      throw new Error('Failed to create checkout URL')
    }

    return checkout.data.data.attributes.url
  } catch (error) {
    console.error('Error creating checkout:', error)
    throw new Error('Failed to create checkout. Please try again.')
  }
} 