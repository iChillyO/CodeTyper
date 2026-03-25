import posthog from 'posthog-js';

// Define the set of valid event names to ensure type safety across the app
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
  | 'delete_bug_hit';

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
  [key: string]: any; // Allow additional arbitrary properties
}

/**
 * Centralized client-side tracking utility.
 * Use this in React components and hooks.
 */
export const track = (event: AnalyticsEvent, props: TrackProps = {}) => {
  // Always include 'client' as the source for browser-side events
  const properties = {
    ...props,
    source: props.source || 'client',
  };

  try {
    // Only track if PostHog has been initialized (handled by PostHogProvider)
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture(event, properties);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Track: ${event}`, properties);
    }
  } catch (err) {
    // Fail silently: analytics shouldn't break the user experience
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics] Failed to capture event:', err);
    }
  }
};

/**
 * Identifies the current user in PostHog.
 * Should be called when the user logs in or their session is loaded.
 */
export const identify = (userId: string, traits: Record<string, any> = {}) => {
  try {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.identify(userId, traits);
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics] Failed to identify user:', err);
    }
  }
};

/**
 * Resets the analystics session (e.g. on logout)
 */
export const reset = () => {
  try {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.reset();
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics] Failed to reset state:', err);
    }
  }
};
