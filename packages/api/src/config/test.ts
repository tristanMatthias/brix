/*******************************************************************************
 *
 *              ! DO NOT PUT ANYTHING SECURE IN THESE FILES !
 *
 ******************************************************************************/
import { CONFIG_DEVELOPMENT } from './development';
import { ApiConfig, Env } from './types';

export const CONFIG_TEST: ApiConfig = {
  ...CONFIG_DEVELOPMENT as ApiConfig,
  env: Env.test
};
