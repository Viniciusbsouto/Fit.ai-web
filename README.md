This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication and Render

Authentication is handled by the Fastify backend. The shared Better Auth client
uses `NEXT_PUBLIC_API_URL` for email sign-in, sign-up, sessions, sign-out and Google
OAuth, with `credentials: "include"`. Its default path is `/api/auth`; do not append
that path to the environment variable or add Next.js authentication routes.

For local development, copy `.env.example` to `.env` and keep
`NEXT_PUBLIC_API_URL=http://localhost:8081`.

On the Render **frontend** service, configure:

```dotenv
NEXT_PUBLIC_API_URL=https://api-fitai.viniciusbsouto.com.br
GOOGLE_OAUTH_ENABLED=false
```

`NEXT_PUBLIC_API_URL` must be available when running the build. After changing it,
rebuild and redeploy the frontend; restarting an existing build is insufficient.
Access public variables as `process.env.NEXT_PUBLIC_API_URL`, without destructuring,
aliases or computed property names, so Next.js can inline them into browser code.
There is no separate authentication URL variable in this frontend.
`NEXT_PUBLIC_BASE_URL` is currently unused; the Google return URL is derived from
`window.location.origin`.

On the **backend**, verify that Better Auth's `baseURL` (or `BETTER_AUTH_URL`) is
`https://api-fitai.viniciusbsouto.com.br`, and that `trustedOrigins` includes
`https://fitai.viniciusbsouto.com.br`. Fastify CORS must allow that exact frontend
origin with credentials enabled. Session cookies must also reach the Next.js
frontend so its existing server-side session checks can forward them to the API.
For these sibling subdomains, configure Better Auth's
`advanced.crossSubDomainCookies` with `enabled: true` and
`domain: "viniciusbsouto.com.br"`, retaining secure cookies over HTTPS. Keep this
production cookie configuration separate from localhost development.

For Google OAuth, configure the provider and its client ID/secret exclusively on
the backend, then set `GOOGLE_OAUTH_ENABLED=true` on the frontend. In Google Cloud,
authorize this production redirect URI:

```text
https://api-fitai.viniciusbsouto.com.br/api/auth/callback/google
```

For local OAuth, use `http://localhost:8081/api/auth/callback/google`.
The existing `callbackURL` in the frontend returns the user to
`https://fitai.viniciusbsouto.com.br/` in production or `http://localhost:3000/`
locally, after the backend handles Google's callback. Backend settings are not
part of this repository and must be checked in its own deployment.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
