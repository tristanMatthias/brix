import findRoot from 'find-root';
import path from 'path';
import resolveFrom from 'resolve-from';

/**
 * A fallback require context function that attempts to load the library path
 * first from the current workspace, then as a relative path, then as a module
 * from where the process is called
 * @param lib LIbrary to load
 * @param context Directory to resolve from
 * @param prefix Prefix of library
 */
export const resolveLib = async (lib: string, context: string = process.cwd(), prefix: string = '') => {
  // If trying to load a relative module
  if (lib.startsWith('/')) return lib;
  if (lib.startsWith('.')) return path.resolve(process.cwd(), lib);

  // Attempt to load module relative to where it's called with opt. prefix
  // EG: lib: user, prefix: brix-plugin-
  const p = await resolveFrom(findRoot(context), `${prefix}${lib}`);

  if (p) return p;

  // Finally attempt to load it from the project's node_modules with opt. prefix
  return await resolveFrom(process.cwd(), `${prefix}${lib}`);
};


/**
 * A fallback require function that attempts to load the library first from the
 * current workspace, then as a relative path, then as a module from where the
 * process is called.
 * @param lib Libary to load
 * @param context Directory to resolve from
 * @param returnDefault If the lib exports a default object, return default
 */
export const importLib = async (lib: string, context: string = process.cwd(), returnDefault = true) => {
  const p = await resolveLib(lib, context);
  if (!p) return false;

  const pkg = require(p);
  if (returnDefault && pkg.default) return pkg.default;
  return pkg;
};
