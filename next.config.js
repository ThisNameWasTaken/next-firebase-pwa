require('dotenv').config();

const env = Object.keys(process.env)
  .filter(key => !key.match(/^(NODE_|__NEXT)/))
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
    dest: 'public',
  },
});
