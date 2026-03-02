export function assetUrl(path) {
  const dynamicBase = import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8000`
  if (!path) return dynamicBase
  return `${dynamicBase}${path.startsWith('/') ? path : `/${path}`}`
}


