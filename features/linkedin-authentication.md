# Feature: LinkedIn Account Authentication

## Summary
Allow users to authenticate (sign in / connect) their LinkedIn account so the app can verify their identity and, optionally, access authorized profile data on their behalf.

## User Story
As a user, I want to sign in with my LinkedIn account so that I can access the app without creating a new password and share relevant profile information automatically.

## Goals
- Provide a "Continue with LinkedIn" button on the auth screen.
- Complete a secure OAuth 2.0 flow with LinkedIn (Sign In with LinkedIn using OpenID Connect).
- Create or link a Supabase user record on successful authentication.
- Persist the session so the user stays signed in across reloads.
- Allow the user to disconnect their LinkedIn account from account settings.

## Non-Goals
- Posting to LinkedIn on the user's behalf (separate feature — requires `w_member_social` scope).
- Importing the user's full LinkedIn network / connections.
- Scraping LinkedIn content.

## User Flow
1. User clicks **Continue with LinkedIn** on `/auth`.
2. Browser redirects to LinkedIn's OAuth consent screen.
3. User approves requested scopes (`openid`, `profile`, `email`).
4. LinkedIn redirects back to the app's callback URL with an authorization code.
5. Supabase exchanges the code for tokens and creates/links the user.
6. User lands on the post-login destination (e.g. `/dashboard`) with an active session.

## Requirements

### Functional
- OAuth provider: LinkedIn (OIDC).
- Scopes requested: `openid profile email`.
- Store on the user profile: `linkedin_sub` (LinkedIn user id), `full_name`, `email`, `avatar_url`, `locale`.
- Handle first-time sign-in vs returning user (link by verified email if account already exists).
- Handle user cancellation and provider errors with a clear message on `/auth`.

### Non-Functional
- Tokens are never exposed to the client; only the Supabase session is stored in the browser.
- Redirect URL is allow-listed in both Supabase and the LinkedIn app.
- Works in preview and production environments (env-driven redirect URL).

## Technical Notes
- Auth is handled by Supabase Auth with the LinkedIn (OIDC) provider enabled in the Supabase dashboard.
- Client call:
  ```ts
  await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
  ```
- A `/auth/callback` route completes the session and redirects.
- An `onAuthStateChange` listener is registered at app root to keep UI in sync.
- If profile data must be stored, create a `profiles` table keyed by `auth.users.id` with RLS restricting rows to `auth.uid()`.

## Configuration / Secrets
Configured in the Supabase dashboard (not committed to the repo):
- LinkedIn **Client ID**
- LinkedIn **Client Secret**
- Authorized redirect URL: `https://<supabase-project>.supabase.co/auth/v1/callback`

In the LinkedIn Developer Portal:
- Create an app, enable **Sign In with LinkedIn using OpenID Connect** product.
- Add the Supabase callback URL to Authorized redirect URLs.

## Acceptance Criteria
- [ ] "Continue with LinkedIn" button visible on `/auth`.
- [ ] Clicking it redirects to LinkedIn and back without errors.
- [ ] A new Supabase user is created on first sign-in; existing user is reused on subsequent sign-ins.
- [ ] Session persists across page reloads.
- [ ] Profile fields (name, email, avatar) are populated from LinkedIn.
- [ ] User can sign out and can disconnect LinkedIn from settings.
- [ ] Cancelling on LinkedIn returns the user to `/auth` with a friendly message.

## Out of Scope / Future Enhancements
- Publishing posts to LinkedIn (`w_member_social`).
- Syncing LinkedIn work history to the user profile.
- Admin analytics on LinkedIn sign-in conversion.
