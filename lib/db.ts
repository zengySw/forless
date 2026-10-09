// Server-only database module - uses dynamic imports for Node.js built-ins
// This file should only be imported in Server Components or API routes

let _pool: any = null;
let _redis: any = null;
let _storage_mode: "postgres" | "redis" | "file" = "file";
let _initialized = false;
let _initializing: Promise<void> | null = null;

// Lazy initialization - only runs on server
async function getPool() {
  if (typeof window !== "undefined") return null;
  if (_pool) return _pool;
  
  const postgresUrl = process.env.DATABASE_URL;
  const postgresConnectionString = process.env.POSTGRES_URL;
  
  if (postgresUrl || postgresConnectionString) {
    try {
      const { Pool } = require("pg");
      _pool = new Pool({ 
        connectionString: postgresUrl || postgresConnectionString,
        ssl: false 
      });
      _storage_mode = "postgres";
    } catch (e) {
      console.error("Failed to initialize pg pool:", e);
    }
  }
  return _pool;
}

async function getRedis() {
  if (typeof window !== "undefined") return null;
  if (_redis) return _redis;
  
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  
  if (url && token) {
    try {
      const { Redis } = require("@upstash/redis");
      _redis = new Redis({ url, token });
      if (!_pool) _storage_mode = "redis";
    } catch (e) {
      console.error("Failed to initialize Redis:", e);
    }
  }
  return _redis;
}

export async function get_storage_mode(): Promise<"postgres" | "redis" | "file"> {
  await getPool();
  await getRedis();
  if (!_pool && !_redis) _storage_mode = "file";
  return _storage_mode;
}

export async function db_init(): Promise<void> {
  if (_initialized) return;
  if (typeof window !== "undefined") return;
  
  const pool = await getPool();
  if (!pool) return;
  if (_initializing) return _initializing;
  
  const initialization = (async () => {
    const client = await pool.connect();
    try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
   `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT
      )
   `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS letters (
        id SERIAL PRIMARY KEY,
        emoji VARCHAR(50),
        condition TEXT,
        text TEXT,
        opened BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
   `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS secrets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        condition TEXT,
        found BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
   `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        icon VARCHAR(50),
        target NUMERIC,
        unlocked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
   `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        achievement_id INTEGER REFERENCES achievements(id),
        unlocked_at TIMESTAMP DEFAULT NOW()
      )
   `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_secrets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        secret_id INTEGER REFERENCES secrets(id),
        found_at TIMESTAMP DEFAULT NOW()
      )
   `);
      console.log("Database tables initialized");
      _initialized = true;
    } finally {
      client.release();
    }
  })();

  _initializing = initialization;
  try {
    await initialization;
  } catch (err) {
    console.error("Database initialization error:", err);
    _initializing = null;
    throw err;
  }
}

async function read_file(): Promise<Record<string, unknown>> {
  if (typeof window !== "undefined") return {};
  try {
    const fs = require("node:fs/promises");
    const path = require("node:path");
    const file_path = path.join(process.cwd(), ".data", "db.json");
    return JSON.parse(await fs.readFile(file_path, "utf8"));
  } catch {
    return {};
  }
}

async function write_file(data: Record<string, unknown>): Promise<void> {
  if (typeof window !== "undefined") return;
  const fs = require("node:fs/promises");
  const path = require("node:path");
  const file_path = path.join(process.cwd(), ".data", "db.json");
  await fs.mkdir(path.dirname(file_path), { recursive: true });
  await fs.writeFile(file_path, JSON.stringify(data, null, 2));
}

export async function db_get(key: string): Promise<unknown> {
  if (typeof window !== "undefined") return null;
  
  const pool = await getPool();
  if (pool) {
    try {
      await db_init();
      const client = await pool.connect();
      try {
        const result = await client.query(
          "SELECT value FROM settings WHERE key = $1",
          [key]
        );
        const value = result.rows[0]?.value;
        if (typeof value !== "string") return value ?? null;
        try {
          return JSON.parse(value);
        } catch {
          // Support rows written before values were stored as JSON.
          return value;
        }
      } finally {
        client.release();
      }
    } catch (err) {
      console.error("db_get error:", err);
      return null;
    }
  }
  
  const redis = await getRedis();
  if (redis) return (await redis.get(`lesya:${key}`)) ?? null;
  
  return (await read_file())[key] ?? null;
}

export async function db_set(key: string, value: unknown): Promise<void> {
  if (typeof window !== "undefined") return;
  
  const pool = await getPool();
  if (pool) {
    await db_init();
    const client = await pool.connect();
    try {
      await client.query(
        "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2",
        [key, JSON.stringify(value)]
      );
    } finally {
      client.release();
    }
    return;
  }
  
  const redis = await getRedis();
  if (redis) {
    await redis.set(`lesya:${key}`, value);
    return;
  }
  
  const all = await read_file();
  all[key] = value;
  await write_file(all);
}
