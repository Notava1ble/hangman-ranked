// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4c430b83554a50a89ddb7c96caba3b62@o4509612126306304.ingest.de.sentry.io/4509612127551568",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  beforeSend(event) {
    if (event.user) {
      // Don't send user's ip address
      delete event.user.ip_address;
      delete event.user.geo;
    }
    return event;
  },
});
