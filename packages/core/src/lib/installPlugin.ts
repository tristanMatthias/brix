import listr, { ListrTask } from 'listr';
import * as yarn from 'yarn-programmatic';
import { Observable } from 'rxjs';

import { Config } from '../config';
import { ErrorPluginsNotInstallable } from '../errors';


const getInfo = async (pkg: string) => {
  try {
    return await yarn.info(pkg);
  } catch (e) {
    return false;
  }
};

export const resolveExternalPlugin = async (pluginName: string): Promise<string | null> => {
  let info: any;
  if (!info) info = await getInfo(`@brix/plugin-${pluginName}`);
  if (!info) info = await getInfo(`brix-plugin-${pluginName}`);
  if (!info) return null;
  return info.name;
};

export const installPlugins = async (plugins: string | string[], dev = false) => {
  await yarn.add(plugins, { dev, cwd: Config.rootDir });
  return true;
};


export const installHandler = async (plugins: string[]) =>
  await (new listr<string[]>(
    plugins.map<ListrTask>(p => ({
      title: `${p}`,
      task: () => new Observable(o => {
        (async () => {
          try {
            o.next(`Resolving ${p} plugin`);
            const name = await resolveExternalPlugin(p);
            if (!name) throw new ErrorPluginsNotInstallable(p);
            o.next(`Installing ${name} plugin...`);
            await installPlugins(name);
            o.next(`Successfully installed ${name}!`);
            o.complete();
          } catch (e) {
            o.error(e);
          }
        })();
      })
    })))
  ).run();
