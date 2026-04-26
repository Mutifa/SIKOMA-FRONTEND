export function assetUrl(path) {
  const base = import.meta.env.VITE_API_BASE_URL
  return `${base}${path}`
}