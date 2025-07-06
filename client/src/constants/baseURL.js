const baseUrl = import.meta.env.VITE_API_BASE_URL.endsWith("/")
  ? import.meta.env.VITE_API_BASE_URL
  : `${import.meta.env.VITE_API_BASE_URL}/`;


export const WEBHOOK_HOST = `${baseUrl}webhook`;
