/**
 * Generate postcss.config.js for exported project
 */

export const generatePostCSSConfig = (): string => `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
