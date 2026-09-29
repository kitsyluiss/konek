/**
 * VPS deployment configuration (nginx config for custom VPS)
 */

import { NGINX_CONF } from './docker';

export const getVpsNginxConf = (): string => {
  return NGINX_CONF.replace('/usr/share/nginx/html', '/var/www/konek/dist');
};
