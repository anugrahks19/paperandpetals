# Paper & Petals Studio

A handmade crafts storefront with a customer booking form and a private order dashboard. The app runs as a standard Next.js server on Antideploy. Bookings are stored in the application's Postgres database; studio sign-in uses Antideploy's Neon Auth service.

## Local development

Requires Node.js 22.13 or newer. Install with npm ci. Antideploy provisions the database and auth variables for the deployed application. For local development, fetch the database and auth environment from the project's Antideploy dashboard/API into a gitignored .env file. Set ADMIN_EMAILS there to a comma-separated list of the studio's approved email addresses.

Run the idempotent database setup with:

    node --env-file=.env scripts/migrate-db.mjs

Then run:

    npm run dev

The public booking page is at /book. The private dashboard is at /admin. An approved studio member signs in with a one-time email code at /admin/sign-in. The API requires a verified email in ADMIN_EMAILS before reading or changing any order.

The collection and booking choices cover crochet book covers and accessories, personalised pebble art, shell art, embroidered felt bookmarks, and leaf-shaped patchwork pouches. Product photographs are original concept imagery; confirm the final design and quote with each customer.

## Deployment

The application ID is saved in .antideploy.json. Antideploy injects DATABASE_URL and Neon Auth variables into the running app. Set ADMIN_EMAILS as an application environment value. The build command runs next build. At startup, an idempotent script creates any missing booking table and then runs next start on the platform port. No Drizzle Kit migration is configured: its separate deploy migration job did not receive DATABASE_URL, so table setup belongs to the application startup step.

The old ChatGPT Sites deployment has separate storage. Its data is not shared with Antideploy. At migration time, that old database had no customer orders.

Never commit .env, an Antideploy account token, or customer records.
