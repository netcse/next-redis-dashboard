// lib/redis.ts
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

let isConnected = false;

export async function connectRedis() {
  if (!isConnected) {
    if (!client.isOpen) {
      await client.connect();
    }
    isConnected = true;
  }
  return client;
}
