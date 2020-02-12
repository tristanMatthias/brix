import findup from 'find-up';
import fs from 'fs-extra';
import yaml from 'yaml';

import { updateConfig, CONFIG } from '.';
import { CONFIG_BASE, dirOrDist } from './base';
import { ApiConfig } from './types';

/**
 * Load a Brix configuration file. Brix will attempt to load it from the root
 * project directory, and look for `brix.yml`, `brix.yaml`, `brix.json` and `.brixrc`
 * files.
 * @param dir Directory to load the config file from
 */
export const loadConfig = async (dir: string = CONFIG_BASE.rootDir!) => {
  if (dir && dir !== CONFIG_BASE.rootDir) {
    await updateConfig({ rootDir: dirOrDist(dir) });
  }

  let yml;
  let json;
  let config: Partial<ApiConfig> = {};

  const find = (p: string[] | string) => findup(p, { cwd: dir });

  const fYaml = await find(['brix.yml', 'brix.yaml']);
  const fJson = await find(['brix.json', '.brixrc']);


  if (fYaml) yml = await fs.readFile(fYaml);
  else if (fJson) json = await fs.readFile(fJson);

  if (yml) {
    config = yaml.parse(yml.toString());
  } else if (json) {
    config = JSON.parse(json.toString());
  }

  if (config && Object.keys(config).length) await updateConfig(config);
  return CONFIG;
};
