const runtimeCaching = [
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxEntries: 2,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
      cacheableResponse: {
        statuses: [200, 300],
      },
    },
  },
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-image-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      cacheableResponse: {
        statuses: [200, 300],
      },
    },
  },
  {
    urlPattern: /\.(?:js)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-js-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      cacheableResponse: {
        statuses: [200, 300],
      },
    },
  },
  {
    urlPattern: /\.(?:css|less)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-style-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      cacheableResponse: {
        statuses: [200, 300],
      },
    },
  },
  {
    urlPattern: /\.(?:json|xml|csv)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-data-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      cacheableResponse: {
        statuses: [200, 300],
      },
    },
  },
  {
    urlPattern: /googleapis\.com\/identitytoolkit\//i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'others',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      cacheableResponse: {
        statuses: [200, 300],
      },
      networkTimeoutSeconds: 10,
      backgroundSync: {
        name: 'retry registration',
        options: { maxRetentionTime: 360 },
      },
    },
  },
  {
    urlPattern: /^(?!firestore.*$).*/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'others',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      cacheableResponse: {
        statuses: [200, 300],
      },
    },
  },
];

require('dotenv').config();

const env = Object.keys(process.env)
  .filter(key => !key.match(/^(NODE_|__)/))
  .reduce(
    (env, key) => ({
      ...env,
      [key]: process.env[key],
    }),
    {}
  );

const withPwa = require('next-pwa');

module.exports = withPwa({
  env,
  pwa: {
    // disable: true,
    dest: 'public',
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching,
  },
});
