import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// Verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret)
    const digest = hmac.update(payload).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
  } catch (error) {
    console.error('Error verifying signature:', error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const signature = headersList.get('x-signature')
    const payload = await req.text()

    if (!signature) {
      console.error('No signature provided in webhook request')
      return new NextResponse('No signature provided', { status: 400 })
    }

    if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      console.error('LEMONSQUEEZY_WEBHOOK_SECRET is not configured')
      return new NextResponse('Webhook secret not configured', { status: 500 })
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(
      payload,
      signature,
      process.env.LEMONSQUEEZY_WEBHOOK_SECRET
    )

    if (!isValid) {
      console.error('Invalid webhook signature')
      return new NextResponse('Invalid signature', { status: 401 })
    }

    const event = JSON.parse(payload)
    console.log('Processing webhook event:', event.meta.event_name)
    
    const supabase = await createClient()

    // Handle different event types
    switch (event.meta.event_name) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_resumed':
      case 'subscription_unpaused':
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: event.data.attributes.user_id,
            status: 'active',
            plan_id: event.data.attributes.variant_id,
            current_period_end: new Date(event.data.attributes.ends_at).toISOString(),
            cancel_at_period_end: event.data.attributes.cancelled,
            lemon_squeezy_id: event.data.id,
            updated_at: new Date().toISOString()
          })
        break

      case 'subscription_cancelled':
      case 'subscription_expired':
      case 'subscription_paused':
        await supabase
          .from('subscriptions')
          .update({
            status: 'inactive',
            cancel_at_period_end: true,
            updated_at: new Date().toISOString()
          })
          .eq('lemon_squeezy_id', event.data.id)
        break

      case 'subscription_payment_success':
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('lemon_squeezy_id', event.data.attributes.subscription_id)
        break

      case 'subscription_payment_failed':
        await supabase
          .from('subscriptions')
          .update({
            status: 'payment_failed',
            updated_at: new Date().toISOString()
          })
          .eq('lemon_squeezy_id', event.data.attributes.subscription_id)
        break

      case 'order_created':
        await supabase
          .from('orders')
          .insert({
            user_id: event.data.attributes.user_id,
            order_id: event.data.id,
            total: event.data.attributes.total,
            status: 'completed',
            created_at: new Date().toISOString()
          })
        break

      case 'order_refunded':
        await supabase
          .from('orders')
          .update({
            status: 'refunded',
            updated_at: new Date().toISOString()
          })
          .eq('order_id', event.data.id)
        break

      default:
        console.log('Unhandled event type:', event.meta.event_name)
    }

    return new NextResponse('Webhook processed', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Webhook error', { status: 500 })
  }
} 