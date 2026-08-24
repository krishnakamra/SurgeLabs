import { pathToFileURL } from "node:url";
import { existsSync, statSync } from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/**
 * Two gaps between how Next resolves modules and how Node does, bridged so
 * build scripts can import the app's TypeScript directly rather than working
 * from a second copy of it:
 *
 *   1. Node's type stripping wants explicit file extensions; the app uses
 *      extensionless relative imports, as Next expects.
 *   2. "@/..." is a tsconfig path alias Node knows nothing about.
 */
function isFile(path) {
  // existsSync alone matches the directory itself, so "@/content" resolved to
  // the folder and Node refused the directory import.
  return existsSync(path) && statSync(path).isFile();
}

function withExtension(path) {
  for (const candidate of [path, `${path}.ts`, `${path}.tsx`, join(path, "index.ts"), join(path, "index.tsx")]) {
    if (isFile(candidate)) return candidate;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) {
    const target = withExtension(resolvePath(ROOT, specifier.slice(2)));
    if (target) return next(pathToFileURL(target).href, context);
  }

  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    const parent = context.parentURL ? dirname(fileURLToPath(context.parentURL)) : ROOT;
    const target = withExtension(resolvePath(parent, specifier));
    if (target) return next(pathToFileURL(target).href, context);
  }

  return next(specifier, context);
}
