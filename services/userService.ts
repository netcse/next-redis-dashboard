import { connectRedis } from '@/lib/redis';
import { User } from '@/types/user';

export async function saveUserToRedis(slug: string, user: User) {
  const userHash: { [key: string]: string } = {
    name: user.name,
    sex: user.sex,
    dob: user.dob,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
  };

  const redis = await connectRedis();
  await redis.hSet(`user:${slug}`, userHash);
}

export async function getUserBySlug(slug: string) {
  const redis = await connectRedis();
  const user = await redis.hGetAll(`user:${slug}`);
  return user;
}

export async function saveMultipleUsers(users: User[]): Promise<string[]> {
  const redis = await connectRedis();
  const savedIds: string[] = [];

  for (const user of users) {
    const requiredFields = ['name', 'sex', 'dob', 'email', 'mobile', 'address'];
    for (const field of requiredFields) {
      if (!(field in user)) {
        throw new Error(`Missing field: ${field}`);
      }
    }

    const id = crypto.randomUUID();

    const userHash: { [key: string]: string } = {
      name: user.name,
      sex: user.sex,
      dob: user.dob,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
    };

    await redis.hSet(`user:${id}`, userHash);
    savedIds.push(id);
  }

  return savedIds;
}

export async function getPaginatedUsers(page: number, limit: number) {
  const redis = await connectRedis();

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  // Get all matching keys
  const userKeys = await redis.keys('user:*');

  const totalUsers = userKeys.length;

  // Slice keys based on pagination
  const paginatedKeys = userKeys.slice(start, end + 1);

  // Fetch user data for each key
  const users = await Promise.all(
    paginatedKeys.map((key) => redis.hGetAll(key))
  );

  return {
    users,
    totalUsers
  };
}