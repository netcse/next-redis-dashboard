import {connectRedis} from '@/lib/redis';
import {User} from '@/types/user';

export async function saveUserToDB(user: User) {
    const userHash: { [key: string]: string } = {
        name: user.name,
        sex: user.sex,
        dob: user.dob,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
    };
    const redis = await connectRedis();
    const id = crypto.randomUUID();
    await redis.hSet(`user:${id}`, userHash);
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

    // Fetch users data for each key
    const users = await Promise.all(
        paginatedKeys.map((key) => redis.hGetAll(key))
    );

    // Add Redis key (id) to each users object
    const usersWithId = users.map((user, index) => {
        const id = paginatedKeys[index].split(':')[1]; // Extract id from key
        return {...user, id};
    });

    return {
        usersWithId,
        totalUsers
    };
}

export async function getUserById(id: string) {
    const redis = await connectRedis();
    const user = await redis.hGetAll(`user:${id}`);
    return user;
}


// This function updates the users data in Redis based on the provided id
// and the data object. It returns the updated users data.

export async function updateUser(id: string, data: Partial<User>) {
    const key = `user:${id}`;
    const redis = await connectRedis();

    // Check if the users hash exists
    const exists = await redis.exists(key);
    if (!exists) return null;

    // Convert Partial<User> into { [key: string]: string }
    const updatedFields: { [key: string]: string } = {};
    for (const [field, value] of Object.entries(data)) {
        if (value !== undefined) {
            updatedFields[field] = value;
        }
    }

    await redis.hSet(key, updatedFields);

    const updatedUser = await redis.hGetAll(key);
    return updatedUser;
}

export async function deleteUserById(id: string) {
    const redis = await connectRedis();
    const key = `user:${id}`;
    const exists = await redis.exists(key);
    if (!exists) return null;
    await redis.del(key);
    return {
        message: 'User deleted successfully'
    };
}
