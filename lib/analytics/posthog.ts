import posthog from 'posthog-js';

let initialized = false;

function hasKey(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN);
}

// No-op until NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is set — safe to call from
// anywhere, anytime, before the project's PostHog token exists.
export function initPostHog(): void {
  if (initialized || typeof window === 'undefined' || !hasKey()) return;
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: true,
    // Session replay is on by default once the project has Recordings
    // enabled; this just makes sure sensitive input types are masked in
    // the replay regardless of project-level defaults.
    session_recording: {
      maskInputOptions: { number: true, email: true, tel: true },
    },
  });
  initialized = true;
}

// Super property attached to every subsequent event in this session — lets
// the two tools (quiz/calculator) be compared side by side in one project
// instead of needing separate PostHog projects.
export function registerTool(tool: 'quiz' | 'calculator'): void {
  if (typeof window === 'undefined' || !hasKey()) return;
  posthog.register({ tool });
}

export function capture(name: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !hasKey()) return;
  posthog.capture(name, properties);
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Called only at lead-submit time. Never sends the raw email to PostHog —
// identifies with a one-way SHA-256 hash instead, so a PostHog profile can
// still be cross-referenced with a Supabase `leads` row later (by hashing
// the same email yourself) without PostHog ever seeing the address itself.
export async function identifyLead(email: string): Promise<void> {
  if (typeof window === 'undefined' || !hasKey()) return;
  const hashed = await sha256Hex(email.trim().toLowerCase());
  posthog.identify(hashed);
}
