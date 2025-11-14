import { neon } from "@neondatabase/serverless";

// Singleton pattern for database connection
let sqlInstance = null;

export function getDbConnection() {
  if (!sqlInstance) {
    sqlInstance = neon(
      "postgresql://neondb_owner:npg_8eHU7FbVTpvD@ep-rapid-pond-ahorbczd-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
    );
  }
  return sqlInstance;
}

// Shared cache across all API routes
export const globalCache = new Map();
export const globalCacheTimes = new Map();
export const TTL = 5 * 60 * 1000; // 5 minutes instead of 1 minute

export function getCachedData(key) {
  const now = Date.now();
  const cached = globalCache.get(key);
  const cachedTime = globalCacheTimes.get(key) || 0;

  if (cached && now - cachedTime < TTL) {
    return { data: cached, fresh: true };
  }

  return { data: cached, fresh: false };
}

export function setCachedData(key, data) {
  globalCache.set(key, data);
  globalCacheTimes.set(key, Date.now());
}
