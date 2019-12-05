import findup from 'find-up';
import fs from 'fs-extra';
import yaml from 'yaml';

import { updateConfig } from '.';
import { CONFIG_BASE } from './base';
import { API_CONFIG } from './types';

export const loadConfigFile = async (dir: string = CONFIG_BASE.rootDir!) => {
  let yml;
  let json;
  let config: Partial<API_CONFIG> = {};

  const find = (p: string[] | string) => findup(p, { cwd: dir });

  const fYaml = await find(['blokz.yml', 'blockz.yaml']);
  const fJson = await find(['blokz.json', '.blockzrc']);


  if (fYaml) yml = await fs.readFile(fYaml);
  else if (fJson) json = await fs.readFile(fJson);

  if (yml) {
    config = yaml.parse(yml.toString());
  } else if (json) {
    config = JSON.parse(json.toString());
  }

  if (config && Object.keys(config).length) await updateConfig(config);
};
