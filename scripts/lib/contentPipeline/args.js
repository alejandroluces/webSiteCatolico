export function parseArgs(argv = process.argv.slice(2)) {
  const args = {};

  for (const raw of argv) {
    if (!raw.startsWith('--')) {
      continue;
    }

    const withoutPrefix = raw.slice(2);
    const eqIndex = withoutPrefix.indexOf('=');

    if (eqIndex === -1) {
      args[withoutPrefix] = true;
      continue;
    }

    const key = withoutPrefix.slice(0, eqIndex);
    const value = withoutPrefix.slice(eqIndex + 1);
    args[key] = value;
  }

  return args;
}

export function getBooleanArg(args, name, defaultValue = false) {
  if (!(name in args)) {
    return defaultValue;
  }

  const value = args[name];
  if (value === true) {
    return true;
  }

  return ['1', 'true', 'yes', 'si', 'sí'].includes(String(value).trim().toLowerCase());
}

export function requireExecuteOrDryRun(args) {
  const execute = getBooleanArg(args, 'execute');
  const dryRun = getBooleanArg(args, 'dry-run', !execute);

  if (execute && dryRun) {
    throw new Error('Usa solo una opcion: --execute o --dry-run.');
  }

  return { execute, dryRun };
}
