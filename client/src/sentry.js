// Errors-only Sentry: no tracing, no session replay - just crash reports,
// which is all a static portfolio needs (and keeps the bundle lean).
// The DSN is public by design (it only identifies where events go, like
// the Web3Forms key). Init is production-only so dev noise never reaches
// the dashboard.
import * as Sentry from '@sentry/react'

const DSN = 'https://825876e41eedb2f34bc03307ece0783f@o4507850203267072.ingest.us.sentry.io/4511754200350720'

export function initSentry() {
  if (!import.meta.env.PROD || !DSN) return
  Sentry.init({
    dsn: DSN,
    sendDefaultPii: false,
  })
}

export { Sentry }
