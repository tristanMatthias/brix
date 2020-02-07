import { CONFIG_BASE } from './base';
import { ApiConfig, Env } from './types';

/*******************************************************************************
 *
 *              ! DO NOT PUT ANYTHING SECURE IN THESE FILES !
 *
 ******************************************************************************/


export const CONFIG_PRODUCTION: ApiConfig = {
  ...CONFIG_BASE as ApiConfig,
  env: Env.production,
  corsAllowFrom: true
};
