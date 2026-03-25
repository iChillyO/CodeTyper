import { PostHog } from 'posthog-node';

// Define the same events to keep server and client in sync
export type AnalyticsEvent = 
  | 'page_view'
  | 'landing_cta_clicked'
  | 'signup_started'
  | 'signup_completed'
  | 'video_create_clicked'
  | 'video_created'
  | 'theme_selected'
  | 'ai_title_generated'
  | 'render_started'
  | 'render_progress_polled'
  | 'render_completed'
  | 'render_failed'
  | 'video_downloaded'
  | 'video_link_copied'
  | 'video_deleted'
  | 'plan_viewed'
  | 'upgrade_clicked'
  | 'checkout_started'
  | 'subscription_activated'
  | 'subscription_renewed'
  | 'subscription_canceled'
  | 'render_stuck_detected'
  | 'feedback_submitted'
  | 'delete_bug_hit'
  | 'render_job_queued'
  | 'render_limit_reached'
  | 'render_concurrency_blocked'
  | 'supabase_write_failed'
  | 'lambda_trigger_failed';

interface TrackProps {
  user_id?: string;
  render_id?: string;
  plan?: string;
  theme?: string;
  code_language?: string;
  format?: string;
  duration_frames?: number;
  duration_seconds?: number;
  status?: string;
  error?: string;
  source?: 'client' | 'api' | 'lambda';
  [key: string]: any;
}

/**
 * Lazy-initialized PostHog client to avoid creating multiple clients during hydration.
 */
let phClient: PostHog | null = null;
const getPostHog = () => {
  if (!phClient && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    phClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      flushAt: 1, // Flush every event immediately (important for short-lived serverless functions)
      flushInterval: 0,
    });
  }
  return phClient;
};

/**
 * Robust server-side tracking (for API routes and background tasks).
 * Always provide a 'userId' if possible to associate this event with the user.
 */
export const trackServer = async (
  userId: string | null,
  event: AnalyticsEvent,
  props: TrackProps = {}
) => {
  const client = getPostHog();
  if (!client) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Analytics-Server] Skip track (no key): ${event}`, props);
    }
    return;
  }

  // Ensure 'userId' is used for identifying; fallback to a default if not provided
  const identityId = userId || 'system';

  try {
    const properties = {
      ...props,
      source: props.source || 'api',
      $timestamp: new Date().toISOString(),
    };

    client.capture({
      distinctId: identityId,
      event: event,
      properties: properties,
    });

    // Ensure we trigger a flush before the function ends
    await client.shutdown();
    phClient = null; // Re-initialize next time
    console.log(`[Analytics-Server] Logged: ${event} for ${identityId}`);
    
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics-Server] Failed to track event:', err);
    }
  }
};
