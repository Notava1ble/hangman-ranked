// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4c430b83554a50a89ddb7c96caba3b62@o4509612126306304.ingest.de.sentry.io/4509612127551568",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
