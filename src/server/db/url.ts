const RFC_URL_SCHEME = /^([A-Za-z][A-Za-z0-9+.-]*):/;

export function databaseUrlScheme(url: string): string | undefined {
  const scheme = RFC_URL_SCHEME.exec(url)?.[1];
  return scheme?.toLowerCase();
}

export function normalizeDatabaseUrlScheme(url: string): string {
  const scheme = RFC_URL_SCHEME.exec(url)?.[1];
  if (!scheme) return url;
  return `${scheme.toLowerCase()}${url.slice(scheme.length)}`;
}

export function fileDatabasePath(url: string): string | undefined {
  if (databaseUrlScheme(url) !== 'file') return undefined;
  return normalizeDatabaseUrlScheme(url).slice('file:'.length);
}

export function isFileDatabaseUrl(url: string): boolean {
  return databaseUrlScheme(url) === 'file';
}
