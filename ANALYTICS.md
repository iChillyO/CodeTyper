# Analytics & Tracking — CodeTyper

CodeTyper uses a hybrid analytics setup to ensure deep product insights while maintaining a rock-solid, source-of-truth render pipeline.

## Stack
1. **Vercel Analytics** — Global traffic, referrers, and page views. Zero configuration on the web.
2. **PostHog (Browser)** — Behavioral analytics, funnel tracking, and UI interaction.
3. **PostHog (Node.js)** — Server-side events from API routes, AWS Lambda renderers, and Supabase hooks.

---

## Architecture

### Centralized Utilities
- **`src/lib/analytics.ts`** — Client-side wrapper around `posthog-js`. All events are typed. Always fails silently.
- **`src/lib/analytics-server.ts`** — Server-side wrapper around `posthog-node`. Used for critical business events.

### Providers
- **`PostHogProvider.tsx`** — Initializes PostHog in the browser. Handles automatic path tracking (page views) and identifies the logged-in user from Supabase.

---

## Priority Events

### 1. The Rendering Pipeline (Source of Truth)
| Event | Trigger Location | Purpose |
|---|---|---|
| `render_job_queued` | `POST /api/render` | Track demand for renders. |
| `render_limit_reached` | `POST /api/render` | Detect users hitting their monthly plan cap. |
| `render_concurrency_blocked` | `POST /api/render` | Track UI friction where users have to wait for an active job. |
| `render_stuck_detected` | `POST /api/render` | Automated recovery analytics when the worker cleans up old jobs. |
| `lambda_trigger_failed` | `render-worker.ts` | Infrastructure health alert — Lambda didn't start. |
| `render_completed` | `render-worker.ts` | Success metric. |
| `render_failed` | `render-worker.ts` | Error metric (Infrastructure/Video side). |
| `supabase_write_failed` | `render-worker.ts` | S3 to Supabase transfer health. |

### 2. Product Usage (UI Interaction)
| Event | UI Action |
|---|---|
| `landing_cta_clicked` | "Generate Video" clicks on landing page. |
| `theme_selected` | Theme dropdown choice. |
| `video_downloaded` | Download button click. |
| `video_link_copied` | Copy link button click. |
| `feedback_submitted` | Success modal emoji clicks. |
| `video_deleted` | Delete confirmation. |

---

## Configuration

To enable tracking, add these to your environment (`.env.local` and Vercel):

```env
# PostHog (Public)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Analytics Toggle (Optional - defaults to enabled in prod)
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

## Local Development
Analytics are automatically disabled in development unless `NEXT_PUBLIC_ANALYTICS_ENABLED=true` is set.
To verify events locally:
1. Open the PostHog dashboard.
2. Go to the **Live Events** tab.
3. Perform actions in your dev environment — events appear within 1-2 seconds.
