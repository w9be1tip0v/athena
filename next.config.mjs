import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable Web Vitals tracking
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // Enable standalone output for Docker
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
}

// Check if Sentry should be enabled
const shouldUseSentry = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
const hasSentryConfig = process.env.SENTRY_ORG && process.env.SENTRY_PROJECT

let finalConfig = nextConfig

if (shouldUseSentry && hasSentryConfig) {
  finalConfig = withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    tunnelRoute: '/monitoring',

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    automaticVercelMonitors: true,

    // Source map configuration using newer options
    sourcemaps: {
      // Use improved source map handling
      disable: false,
      // Clean up source maps after upload for better security
      deleteSourcemapsAfterUpload: true,
      // Custom source rewriting to improve source map references
      rewriteSources: (source) => {
        // Remove absolute paths and make sources relative
        if (source.startsWith('webpack://')) {
          return source.replace('webpack://', '~/')
        }
        return source.replace(process.cwd(), '~')
      },
    },

    // Webpack configuration to improve source map generation
    webpack: (config, { isServer, dev }) => {
      // Only modify source map settings for production builds
      if (!dev) {
        // Use hidden source maps for client-side to prevent public exposure
        if (!isServer) {
          config.devtool = 'hidden-source-map'
        } else {
          // Use regular source maps for server-side
          config.devtool = 'source-map'
        }
      }
      return config
    },
  })
} else {
  console.log('⚠️ Sentry configuration incomplete - building without Sentry source map upload')
  if (shouldUseSentry && !hasSentryConfig) {
    console.log('💡 Set SENTRY_ORG and SENTRY_PROJECT environment variables to enable Sentry source maps')
  }
}

export default finalConfig
