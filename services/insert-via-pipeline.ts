import { createClient } from 'redis';
import { faker } from '@faker-js/faker';

const TOTAL_USERS = 1_000_000;
const BATCH_SIZE = 1000;

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error', err);
});

async function generateUser() {
  return {
    name: faker.person.fullName(),
    sex: faker.helpers.arrayElement(['Male', 'Female']),
    dob: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0],
    email: faker.internet.email(),
    mobile: '01' + faker.string.numeric(9),
    address: faker.location.streetAddress(),
  };
}

async function insertUsers() {
  await client.connect();
  console.log('🚀 Connected to Redis');

  for (let i = 1; i <= TOTAL_USERS; i += BATCH_SIZE) {
    const pipeline = client.multi();

    for (let j = 0; j < BATCH_SIZE && i + j <= TOTAL_USERS; j++) {
      const id = i + j;

      const user = await generateUser();
      pipeline.hSet(`user:${crypto.randomUUID()}`, user);
    }

    await pipeline.exec();
    console.log(`✅ Inserted users ${i} to ${Math.min(i + BATCH_SIZE - 1, TOTAL_USERS)}`);
  }

  await client.quit();
  console.log('🎉 All users inserted and Redis connection closed.');
}

insertUsers().catch(console.error);
