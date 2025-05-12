import { connectRedis } from '@/lib/redis';

export async function saveName(name: string) {
  if (!name) {
    throw new Error('Invalid name');
  }
  const redis = await connectRedis();
  await redis.set('name', name);
}
export async function getName() {
  const redis = await connectRedis();
  const name = await redis.get('name');
  if (!name) {
    throw new Error('Name not found');
  }
  return name;
}