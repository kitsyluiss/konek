/**
 * Heroku deployment configuration
 */

export const HEROKU_STATIC_JSON = `{
  "root": "dist/",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}
`;
