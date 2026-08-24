/**
 * Node's type stripping requires explicit file extensions; the app's TS uses
 * extensionless relative imports, as Next expects. This hook resolves the
 * difference so build scripts can import the content layer directly rather
 * than working from a duplicate copy of it.
 */
export async function resolve(specifier, context, next) {
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    try {
      return await next(`${specifier}.ts`, context);
    } catch {
      // fall through to the default resolver
    }
  }
  return next(specifier, context);
}
