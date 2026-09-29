/**
 * Deployment configurations
 */

export type { ExportDeploymentTarget } from './types';
export { VERCEL_JSON } from './vercel';
export { NETLIFY_TOML } from './netlify';
export { GITHUB_WORKFLOW_YAML } from './githubPages';
export { NGINX_CONF, DOCKERFILE, DOCKERIGNORE } from './docker';
export { getVpsNginxConf } from './vps';
export { HEROKU_STATIC_JSON } from './heroku';
export { generateDeployMd } from './readme';
