import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

// Force next-intl to use Webpack resolver (next-intl/config). When TURBOPACK is set,
// the plugin uses experimental.turbo.resolveAlias which doesn't resolve the config;
// we use --webpack in dev/build, so clear TURBOPACK so the plugin picks the Webpack branch.
delete process.env.TURBOPACK;

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const I18N_REQUEST_PATH = './src/i18n/request.ts';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, options) {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    // Always set next-intl/config -> our request.ts so getMessages() resolves it
    // even if the plugin chose the Turbo branch and did not add its webpack alias.
    config.resolve.alias['next-intl/config'] = path.resolve(
      config.context || process.cwd(),
      I18N_REQUEST_PATH
    );
    return config;
  },
};

const config = withNextIntl(nextConfig);
// Next 16 moved turbo out of experimental; remove to avoid "Unrecognized key 'turbo'" warning
if (config.experimental && 'turbo' in config.experimental) {
  const { turbo, ...rest } = config.experimental;
  config.experimental = Object.keys(rest).length ? rest : undefined;
}
export default config;
